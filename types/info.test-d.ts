import { expectTypeOf } from "vitest"

import { FieldInfo, UdfFieldInfo } from "./info"

describe("field info", () => {
  type NonStringDataType =
    | "boolean"
    | "integer"
    | "long"
    | "double"
    | "decimal"
    | "datetime"

  describe("picklists", () => {
    type Picklist = Extract<FieldInfo, { isPicklist: true }>

    it("should allow integer data types", () => {
      expectTypeOf<Picklist>().toMatchTypeOf<{ dataType: "integer" }>()
    })

    it("should not allow non-integer data types", () => {
      // @ts-expect-error - 'string' is not a valid data type
      expectTypeOf<Picklist>().toMatchTypeOf<{
        dataType: "string" | Exclude<NonStringDataType, "integer">
      }>()
    })

    describe("standard picklists", () => {
      type StandardPicklist = Extract<
        Picklist,
        { picklistParentValueField: "" }
      >

      it("should have an empty string parentValue in picklistValues", () => {
        expectTypeOf<StandardPicklist>().toMatchTypeOf<{
          picklistValues: { parentValue: "" }[]
        }>()
      })
    })

    describe("child picklists", () => {
      type ChildPicklist = Exclude<Picklist, { picklistParentValueField: "" }>

      it("should have string picklistParentValueField", () => {
        expectTypeOf<ChildPicklist>().toMatchTypeOf<{
          picklistParentValueField: string
        }>()
      })

      it("should have a string parentValue in picklistValues", () => {
        expectTypeOf<ChildPicklist>().toMatchTypeOf<{
          picklistValues: { parentValue: string }[]
        }>()
      })

      it("should not have have an empty string parentValue in picklistValues", () => {
        // @ts-expect-error - `parentValue` should be a string.
        expectTypeOf<ChildPicklist>().toMatchTypeOf<{
          picklistValues: { parentValue: "" }[]
        }>()
      })
    })

    it("should have an empty string referenceEntityType", () => {
      expectTypeOf<Picklist>().toMatchTypeOf<{ referenceEntityType: "" }>()
    })
  })

  describe("references", () => {
    type Reference = Extract<FieldInfo, { isReference: true }>

    it("should allow integer data types", () => {
      expectTypeOf<Reference>().toMatchTypeOf<{ dataType: "integer" }>()
    })

    it("should not allow non-integer data types", () => {
      // @ts-expect-error - `dataType` should be an integer.
      expectTypeOf<Picklist>().toMatchTypeOf<{
        dataType: "string" | Exclude<NonStringDataType, "integer">
      }>()
    })

    it("should have an empty string picklistParentValueField", () => {
      expectTypeOf<Reference>().toMatchTypeOf<{
        picklistParentValueField: ""
      }>()
    })

    it("should have a null picklistValues", () => {
      expectTypeOf<Reference>().toMatchTypeOf<{ picklistValues: null }>()
    })

    it("should have a string referenceEntityType", () => {
      expectTypeOf<Reference>().toMatchTypeOf<{ referenceEntityType: string }>()
    })

    it("should not have an empty string referenceEntityType", () => {
      // @ts-expect-error - `referenceEntityType` should be a string.
      expectTypeOf<Reference>().toMatchTypeOf<{ referenceEntityType: "" }>()
    })
  })

  describe("non-string fields", () => {
    type NonString = Extract<FieldInfo, { dataType: NonStringDataType }>

    it("should have a zeroed maxLength", () => {
      expectTypeOf<NonString>().toMatchTypeOf<{ maxLength: 0 }>()
    })

    it("should disallow non-zero maxLength", () => {
      // @ts-expect-error - 'invalid' is not a valid data type
      expectTypeOf<NonString>().toMatchTypeOf<{ maxLength: 1 }>()
    })
  })

  describe("string fields", () => {
    type String = Extract<FieldInfo, { dataType: "string" }>

    it("should allow integer maxLength", () => {
      expectTypeOf<String>().toMatchTypeOf<{ maxLength: number }>()
    })

    it("should have an empty string picklistParentValueField", () => {
      expectTypeOf<String>().toMatchTypeOf<{ picklistParentValueField: "" }>()
    })

    it("should have a null picklistValues", () => {
      expectTypeOf<String>().toMatchTypeOf<{ picklistValues: null }>()
    })
  })
})

describe("user-defined field info", () => {
  type NonStringDataType = "integer" | "double" | "datetime"

  describe("picklists", () => {
    type Picklist = Extract<UdfFieldInfo, { isPicklist: true }>

    it("should allow integer types", () => {
      expectTypeOf<Picklist>().toMatchTypeOf<{ type: "integer" }>()
    })

    it("should not allow non-integer types", () => {
      // @ts-expect-error - 'string' is not a valid data type
      expectTypeOf<Picklist>().toMatchTypeOf<{
        type: "string" | Exclude<NonStringDataType, "integer">
      }>()
    })

    describe("standard picklists", () => {
      type StandardPicklist = Extract<
        Picklist,
        { picklistParentValueField: null }
      >

      it("should have an empty string parentValue in picklistValues", () => {
        expectTypeOf<StandardPicklist>().toMatchTypeOf<{
          picklistValues: { parentValue: "" }[]
        }>()
      })
    })

    describe("child picklists", () => {
      type ChildPicklist = Exclude<Picklist, { picklistParentValueField: null }>

      it("should have string picklistParentValueField", () => {
        expectTypeOf<ChildPicklist>().toMatchTypeOf<{
          picklistParentValueField: string
        }>()
      })

      it("should have a string parentValue in picklistValues", () => {
        expectTypeOf<ChildPicklist>().toMatchTypeOf<{
          picklistValues: { parentValue: string }[]
        }>()
      })

      it("should not have have an empty string parentValue in picklistValues", () => {
        // @ts-expect-error - `parentValue` should be a string.
        expectTypeOf<ChildPicklist>().toMatchTypeOf<{
          picklistValues: { parentValue: "" }[]
        }>()
      })
    })

    it("should have a null referenceEntityType", () => {
      expectTypeOf<Picklist>().toMatchTypeOf<{ referenceEntityType: null }>()
    })
  })

  describe("references", () => {
    type Reference = Extract<UdfFieldInfo, { isReference: true }>

    it("should allow integer types", () => {
      expectTypeOf<Reference>().toMatchTypeOf<{ type: "integer" }>()
    })

    it("should not allow non-integer types", () => {
      // @ts-expect-error - `type` should be an integer.
      expectTypeOf<Picklist>().toMatchTypeOf<{
        type: "string" | Exclude<NonStringDataType, "integer">
      }>()
    })

    it("should have a null picklistParentValueField", () => {
      expectTypeOf<Reference>().toMatchTypeOf<{
        picklistParentValueField: null
      }>()
    })

    it("should have a null picklistValues", () => {
      expectTypeOf<Reference>().toMatchTypeOf<{ picklistValues: null }>()
    })

    it("should have a string referenceEntityType", () => {
      expectTypeOf<Reference>().toMatchTypeOf<{ referenceEntityType: string }>()
    })
  })

  describe("non-string fields", () => {
    type NonString = Extract<UdfFieldInfo, { type: NonStringDataType }>

    it("should have a zeroed length", () => {
      expectTypeOf<NonString>().toMatchTypeOf<{ length: 0 }>()
    })

    it("should disallow non-zero length", () => {
      // @ts-expect-error - 'invalid' is not a valid data type
      expectTypeOf<NonString>().toMatchTypeOf<{ length: 1 }>()
    })
  })

  describe("string fields", () => {
    type String = Extract<UdfFieldInfo, { type: "string" }>

    it("should allow integer length", () => {
      expectTypeOf<String>().toMatchTypeOf<{ length: number }>()
    })

    it("should have a null picklistParentValueField", () => {
      expectTypeOf<String>().toMatchTypeOf<{ picklistParentValueField: null }>()
    })

    it("should have a null picklistValues", () => {
      expectTypeOf<String>().toMatchTypeOf<{ picklistValues: null }>()
    })
  })
})
