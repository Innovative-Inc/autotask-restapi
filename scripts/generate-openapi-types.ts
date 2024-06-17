import fs from "node:fs/promises"
import * as path from "node:path"
import { Readable } from "node:stream"
import { fileURLToPath } from "node:url"

import StreamZip from "node-stream-zip"
import * as prettier from "prettier"
import { z } from "zod"

const remoteSpec =
  "https://webservices3.autotask.net/ATServicesRest/swagger/docs/v1"
const remoteGenerator = "https://generator3.swagger.io/api/generate"
const localVendorPath = "vendor/openapi-entity-types"
const generatedSpecPath = `${localVendorPath}/spec.json`
const generatedTypesPath = `${localVendorPath}/api.ts`

// Spec cleanup configuration.
const definitionPrefixesToRemove = [
  "EntityInformation",
  "Expression",
  "Field",
  "ItemQueryResult",
  "Process",
  "QueryActionResult"
] as const
const definitionsToRemove = [
  "AuthTokenResultModel",
  "CountActionResult",
  "Filter",
  "GlobalEntityInformationResultModel",
  "OperationActionResult",
  "PagingModel",
  "ParameterExpression",
  "PickListValue",
  "QueryCountResultModel",
  "QueryModel",
  "RestUserAccessLevel",
  "UserDefinedFieldInformationResultModel"
] as const
const definitionSuffixToTrim = "Model"

// Client cleanup configuration.
const filesToExtract = ["api.ts", ".swagger-codegen/VERSION"] as const
const lineNumbersToRemove: ((index: number) => boolean)[] = [
  // Unnecessary top-level file comments.
  (index: number) => index < 3,
  // Unnecessary client-specific definitions.
  (index: number) => index > 14 && index < 80
] as const
const linePatternsToRemove: RegExp[] = [
  // Unnecessary interface docs.
  /\* @export/,
  /\* @interface/,
  // Unnecessary property docs.
  /\* @memberof/,
  /\* @type/
] as const
const linePatternsToReplace: [RegExp, string][] = [
  // Replace `export interface` with `export type` for better flexibility.
  [/^export interface (.+) \{/gm, "export type $1 = {"],
  // Provide generic type for entities with user-defined fields.
  [
    /^(export type \S+?) = \{\n(([^}])+?userDefinedFields\??:).+/gm,
    "$1<UDF extends string = string> = {\n$2 UserDefinedField<UDF>[]"
  ],
  // Make UserDefinedField properties required.
  [
    /^export type UserDefinedField = \{\n +name\?: string\n +value\?: string\n}/gm,
    "export type UserDefinedField<Name extends string = string> = {\n  name: Name\n  value: string\n}"
  ]
] as const

const specSchema = z
  .object({
    // Ensure the spec is OpenAPI 2.0.
    swagger: z.literal("2.0"),
    // Ensure the API version is v1.
    info: z.object({ version: z.literal("v1") }).passthrough(),
    // Don't care about the `paths` schema since it will be replaced with an
    // empty object.
    paths: z.any(),
    // There are other properties, but since they're not needed for our purposes,
    // just pass them through.
    definitions: z.record(z.object({ properties: z.any() }).passthrough())
  })
  .passthrough()

/**
 * Fetches and cleans up the remote Autotask API spec.
 *
 * @returns The cleaned-up spec.
 */
async function generateSpec() {
  console.log("Fetching spec...")
  // Retrieve the remote Autotask API spec.
  const response = await fetch(remoteSpec)
  const spec = specSchema.parse(await response.json())
  spec.paths = {}
  console.log("Done.")

  console.log("Cleaning up definitions...")
  for (const key of Object.keys(spec.definitions)) {
    // Remove unnecessary definitions.
    if (
      definitionPrefixesToRemove.some((prefix) => key.startsWith(prefix)) ||
      definitionsToRemove.includes(key as (typeof definitionsToRemove)[number])
    ) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete spec.definitions[key]
      continue
    }

    // Rename models to remove the `Model` suffix.
    if (key.endsWith(definitionSuffixToTrim)) {
      const newKey = key.slice(0, -definitionSuffixToTrim.length)
      spec.definitions[newKey] = spec.definitions[key]
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete spec.definitions[key]
    }
  }
  console.log("Done.")

  console.log("Removing unnecessary properties...")
  for (const path of Object.values(spec.definitions)) {
    for (const propertyKey of Object.keys(path.properties)) {
      if (propertyKey === "soapParentPropertyId") {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete path.properties[propertyKey]
      }
    }
  }
  console.log("Done.")

  return spec
}

/**
 * Compares the remote spec with the existing spec, if it exists. If they're the
 * same, the process exits early since there's no need to regenerate the
 * client.
 *
 * @param spec The remote spec to compare.
 */
async function compareSpec(spec: z.infer<typeof specSchema>) {
  console.log("Comparing spec to existing spec...")
  try {
    const existingSpecContents = await fs.readFile(generatedSpecPath, "utf-8")
    const existingSpec = specSchema.parse(JSON.parse(existingSpecContents))

    if (JSON.stringify(spec) === JSON.stringify(existingSpec)) {
      console.log("Specs are the same, exiting.")
      process.exit(0)
    }
    console.log("Specs are different, generating a new client.")
  } catch {
    console.log("No valid existing spec found, generating a new client.")
  }
  console.log("Done.")

  console.log("Writing spec to file...")
  await fs.mkdir(localVendorPath, { recursive: true })
  // Don't make human-readable, since it almost doubles the file size.
  await fs.writeFile(generatedSpecPath, JSON.stringify(spec))
  console.log("Done.")
}

async function generateClient(spec: z.infer<typeof specSchema>) {
  console.log("Generating client...")
  const zipPath = "client.zip"

  // Request the OpenAPI client codegen service to generate a TypeScript client.
  console.log("Requesting client generation...")
  const generatorPayload = {
    codegenVersion: "V2",
    lang: "typescript-fetch",
    options: { additionalProperties: { supportsES6: true } },
    type: "CLIENT",
    spec
  }
  const response = await fetch(remoteGenerator, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(generatorPayload)
  })
  if (!response.ok) {
    throw new Error(`Failed to generate client: ${response.statusText}`)
  }
  if (!response.body) throw new Error("No body in response")
  // Write to file since the ZIP spec doesn't support streaming (requires
  // random access).
  console.log("Downloading client ZIP...")
  await fs.writeFile(zipPath, Readable.fromWeb(response.body))
  console.log("Done.")

  // Ensure the local client directory exists.
  console.log("Resetting vendor client directory...")
  await fs.mkdir(localVendorPath, { recursive: true })
  // Remove existing generated files.
  for await (const entry of await fs.opendir(localVendorPath)) {
    if (entry.path.endsWith(generatedSpecPath)) continue
    await fs.rm(`${localVendorPath}/${entry.name}`, {
      force: true,
      recursive: true
    })
  }

  // Extract the ZIP file contents.
  console.log("Unzipping client...")
  const zip = new StreamZip.async({ file: zipPath })
  try {
    zip.on("extract", (entry, file) => {
      console.log(`Extracted ${entry.name} to ${file}`)
    })
    // Only extract the needed files.
    for (const file of filesToExtract) {
      // Create the parent directory, if applicable and it doesn't exist.
      const dirName = path.dirname(file)
      if (dirName !== ".") {
        await fs.mkdir(`${localVendorPath}/${dirName}`, { recursive: true })
      }
      // Extract the file.
      await zip.extract(file, `${localVendorPath}/${file}`)
    }
  } catch (error) {
    console.trace(error)
  } finally {
    await zip.close()
  }
  // Remove the ZIP file.
  await fs.unlink(zipPath)

  // Remove unneeded, static lines from the generated client.
  console.log("Cleaning up content...")
  const prettierConfig = await prettier.resolveConfig(generatedTypesPath)
  if (!prettierConfig) {
    throw new Error("Prettier config not found")
  }
  // Read file
  let content = await fs.readFile(generatedTypesPath, "utf-8")
  // Remove unwanted lines
  content = content
    .split("\n")
    .filter(
      (_, index) =>
        !lineNumbersToRemove.some((fn) => fn(index + 1)) &&
        !linePatternsToRemove.some((pattern) => pattern.test(_))
    )
    .join("\n")
  // Format using Prettier (run twice total for easier regex matching)
  content = await prettier.format(content, {
    ...prettierConfig,
    parser: "typescript"
  })
  // Replace unwanted patterns
  for (const [pattern, replacement] of linePatternsToReplace) {
    content = content.replace(pattern, replacement)
  }
  // Format again using Prettier
  content = await prettier.format(content, {
    ...prettierConfig,
    parser: "typescript"
  })
  await fs.writeFile(generatedTypesPath, content)

  // Create index file.
  console.log("Creating index file...")
  await fs.writeFile(`${localVendorPath}/index.ts`, `export * from "./api"\n`)

  console.log("Done.")
}

async function run() {
  const spec = await generateSpec()
  await compareSpec(spec)
  await generateClient(spec)
}

// Workaround to require.main check for ESM
// https://stackoverflow.com/a/60309682/3443946
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run().catch(console.trace)
}
