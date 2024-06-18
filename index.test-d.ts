import { expectTypeOf } from "vitest"

import { AutotaskRestApi } from "./index"

describe("client", () => {
  it("should have entities as properties", () => {
    expectTypeOf(AutotaskRestApi).instance.toHaveProperty("Companies")
    expectTypeOf(AutotaskRestApi).instance.toHaveProperty(
      "ConfigurationItemAttachments"
    )
    expectTypeOf(AutotaskRestApi).instance.toHaveProperty("Modules")
  })
})
