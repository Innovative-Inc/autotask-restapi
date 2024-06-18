import { assertType } from "vitest"

import { FilterOperators } from "../index"
import { Company } from "../vendor/openapi-entity-types"
import { FilterInput } from "./filters"

describe("grouping", () => {
  it("should allow valid properties", () => {
    assertType<FilterInput<Company>>({ filter: [{ op: "and", items: [] }] })
    assertType<FilterInput<Company>>({ filter: [{ op: "or", items: [] }] })
  })

  it("should disallow invalid properties", () => {
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `field` is not a valid property in this context.
      filter: [{ op: "and", field: "test" }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `field` is not a valid property in this context.
      filter: [{ op: "or", field: "test" }]
    })
  })
})

describe("equality", () => {
  it("should allow valid properties", () => {
    assertType<FilterInput<Company>>({
      filter: [{ field: "id", op: FilterOperators.eq, value: 0 }]
    })
    assertType<FilterInput<Company>>({
      filter: [{ field: "id", op: FilterOperators.noteq, value: 0 }]
    })
  })

  it("should disallow invalid properties", () => {
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `items` is not a valid property in this context.
      filter: [{ op: FilterOperators.eq, items: [] }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `items` is not a valid property in this context.
      filter: [{ op: FilterOperators.noteq, items: [] }]
    })
  })
})

describe("comparison", () => {
  it("should allow valid properties", () => {
    assertType<FilterInput<Company>>({
      filter: [{ field: "id", op: FilterOperators.gt, value: 0 }]
    })
    assertType<FilterInput<Company>>({
      filter: [{ field: "id", op: FilterOperators.gte, value: 0 }]
    })
    assertType<FilterInput<Company>>({
      filter: [{ field: "id", op: FilterOperators.lt, value: 0 }]
    })
    assertType<FilterInput<Company>>({
      filter: [{ field: "id", op: FilterOperators.lte, value: 0 }]
    })
  })

  it("should disallow invalid properties", () => {
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `items` is not a valid property in this context.
      filter: [{ op: FilterOperators.gt, items: [] }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `items` is not a valid property in this context.
      filter: [{ op: FilterOperators.gte, items: [] }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `items` is not a valid property in this context.
      filter: [{ op: FilterOperators.lt, items: [] }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `items` is not a valid property in this context.
      filter: [{ op: FilterOperators.lte, items: [] }]
    })
  })

  it("should disallow boolean values", () => {
    assertType<FilterInput<Company>>({
      // @ts-expect-error - a boolean is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.gt, value: true }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - a boolean is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.gte, value: true }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - a boolean is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.lt, value: true }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - a boolean is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.lte, value: true }]
    })
  })

  it("should disallow null values", () => {
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `null` is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.gt, value: null }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `null` is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.gte, value: null }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `null` is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.lt, value: null }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `null` is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.lte, value: null }]
    })
  })
})

describe("string", () => {
  it("should allow valid properties", () => {
    assertType<FilterInput<Company>>({
      filter: [{ field: "id", op: FilterOperators.contains, value: "test" }]
    })
    assertType<FilterInput<Company>>({
      filter: [{ field: "id", op: FilterOperators.beginsWith, value: "test" }]
    })
    assertType<FilterInput<Company>>({
      filter: [{ field: "id", op: FilterOperators.endsWith, value: "test" }]
    })
  })

  it("should disallow invalid properties", () => {
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `items` is not a valid property in this context.
      filter: [{ op: FilterOperators.contains, items: [] }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `items` is not a valid property in this context.
      filter: [{ op: FilterOperators.beginsWith, items: [] }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `items` is not a valid property in this context.
      filter: [{ op: FilterOperators.endsWith, items: [] }]
    })
  })

  it("should disallow number values", () => {
    assertType<FilterInput<Company>>({
      // @ts-expect-error - a number is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.contains, value: 0 }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - a number is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.beginsWith, value: 0 }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - a number is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.endsWith, value: 0 }]
    })
  })

  it("should disallow null values", () => {
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `null` is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.contains, value: null }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `null` is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.beginsWith, value: null }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `null` is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.endsWith, value: null }]
    })
  })

  it("should disallow boolean values", () => {
    assertType<FilterInput<Company>>({
      // @ts-expect-error - a boolean is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.contains, value: true }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - a boolean is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.beginsWith, value: true }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - a boolean is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.endsWith, value: true }]
    })
  })
})

describe("existence", () => {
  it("should allow valid properties", () => {
    assertType<FilterInput<Company>>({
      filter: [{ field: "id", op: FilterOperators.exist }]
    })
    assertType<FilterInput<Company>>({
      filter: [{ field: "id", op: FilterOperators.notExist }]
    })
  })

  it("should disallow invalid properties", () => {
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `value` is not a valid property in this context.
      filter: [{ op: FilterOperators.exist, value: "test" }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `value` is not a valid property in this context.
      filter: [{ op: FilterOperators.notExist, value: "test" }]
    })
  })
})

describe("set", () => {
  it("should allow valid properties", () => {
    assertType<FilterInput<Company>>({
      filter: [{ field: "id", op: FilterOperators.in, value: [0] }]
    })
    assertType<FilterInput<Company>>({
      filter: [{ field: "id", op: FilterOperators.notIn, value: [0] }]
    })
  })

  it("should disallow invalid properties", () => {
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `items` is not a valid property in this context.
      filter: [{ op: FilterOperators.in, items: [] }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - `items` is not a valid property in this context.
      filter: [{ op: FilterOperators.notIn, items: [] }]
    })
  })

  it("should disallow non-array values", () => {
    assertType<FilterInput<Company>>({
      // @ts-expect-error - a number is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.in, value: 0 }]
    })
    assertType<FilterInput<Company>>({
      // @ts-expect-error - a number is not a valid value in this context.
      filter: [{ field: "id", op: FilterOperators.notIn, value: 0 }]
    })
  })
})
