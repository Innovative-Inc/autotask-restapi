import {
  AutotaskRestApi,
  CountInput,
  CountResponse,
  CreateResponse,
  DeleteResponse,
  Entity,
  FieldInfo,
  FieldInfoResponse,
  FilterOperators,
  GetResponse,
  InfoResponse,
  QueryInput,
  QueryResponse,
  RequestOptions,
  UdfFieldInfo,
  UdfInfoResponse,
  UpdateResponse
} from "./index"

type Company = {
  id: number
  companyName: string
  userDefinedFields: [{ name: "Test"; value: string }]
}

const api = new AutotaskRestApi("", "", "")

describe("client", () => {
  it("should have entities as properties", () => {
    expectTypeOf(AutotaskRestApi).instance.toHaveProperty("Companies")
    expectTypeOf(AutotaskRestApi).instance.toHaveProperty(
      "ConfigurationItemAttachments"
    )
  })
})

describe("filter operators", () => {
  describe("grouping", () => {
    it("should allow valid properties", () => {
      assertType<CountInput>({ filter: [{ op: "and", items: [] }] })
      assertType<CountInput>({ filter: [{ op: "or", items: [] }] })
    })

    it("should disallow invalid properties", () => {
      // @ts-expect-error - `field` is not a valid property in this context.
      assertType<CountInput>({ filter: [{ op: "and", field: "test" }] })
      // @ts-expect-error - `field` is not a valid property in this context.
      assertType<CountInput>({ filter: [{ op: "or", field: "test" }] })
    })
  })

  describe("equality", () => {
    it("should allow valid properties", () => {
      assertType<CountInput>({
        filter: [{ field: "id", op: FilterOperators.eq, value: 0 }]
      })
      assertType<CountInput>({
        filter: [{ field: "id", op: FilterOperators.noteq, value: 0 }]
      })
    })

    it("should disallow invalid properties", () => {
      assertType<CountInput>({
        // @ts-expect-error - `items` is not a valid property in this context.
        filter: [{ op: FilterOperators.eq, items: [] }]
      })
      assertType<CountInput>({
        // @ts-expect-error - `items` is not a valid property in this context.
        filter: [{ op: FilterOperators.noteq, items: [] }]
      })
    })
  })

  describe("comparison", () => {
    it("should allow valid properties", () => {
      assertType<CountInput>({
        filter: [{ field: "id", op: FilterOperators.gt, value: 0 }]
      })
      assertType<CountInput>({
        filter: [{ field: "id", op: FilterOperators.gte, value: 0 }]
      })
      assertType<CountInput>({
        filter: [{ field: "id", op: FilterOperators.lt, value: 0 }]
      })
      assertType<CountInput>({
        filter: [{ field: "id", op: FilterOperators.lte, value: 0 }]
      })
    })

    it("should disallow invalid properties", () => {
      assertType<CountInput>({
        // @ts-expect-error - `items` is not a valid property in this context.
        filter: [{ op: FilterOperators.gt, items: [] }]
      })
      assertType<CountInput>({
        // @ts-expect-error - `items` is not a valid property in this context.
        filter: [{ op: FilterOperators.gte, items: [] }]
      })
      assertType<CountInput>({
        // @ts-expect-error - `items` is not a valid property in this context.
        filter: [{ op: FilterOperators.lt, items: [] }]
      })
      assertType<CountInput>({
        // @ts-expect-error - `items` is not a valid property in this context.
        filter: [{ op: FilterOperators.lte, items: [] }]
      })
    })

    it("should disallow boolean values", () => {
      assertType<CountInput>({
        // @ts-expect-error - a boolean is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.gt, value: true }]
      })
      assertType<CountInput>({
        // @ts-expect-error - a boolean is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.gte, value: true }]
      })
      assertType<CountInput>({
        // @ts-expect-error - a boolean is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.lt, value: true }]
      })
      assertType<CountInput>({
        // @ts-expect-error - a boolean is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.lte, value: true }]
      })
    })

    it("should disallow null values", () => {
      assertType<CountInput>({
        // @ts-expect-error - `null` is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.gt, value: null }]
      })
      assertType<CountInput>({
        // @ts-expect-error - `null` is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.gte, value: null }]
      })
      assertType<CountInput>({
        // @ts-expect-error - `null` is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.lt, value: null }]
      })
      assertType<CountInput>({
        // @ts-expect-error - `null` is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.lte, value: null }]
      })
    })
  })

  describe("string", () => {
    it("should allow valid properties", () => {
      assertType<CountInput>({
        filter: [{ field: "id", op: FilterOperators.contains, value: "test" }]
      })
      assertType<CountInput>({
        filter: [{ field: "id", op: FilterOperators.beginsWith, value: "test" }]
      })
      assertType<CountInput>({
        filter: [{ field: "id", op: FilterOperators.endsWith, value: "test" }]
      })
    })

    it("should disallow invalid properties", () => {
      assertType<CountInput>({
        // @ts-expect-error - `items` is not a valid property in this context.
        filter: [{ op: FilterOperators.contains, items: [] }]
      })
      assertType<CountInput>({
        // @ts-expect-error - `items` is not a valid property in this context.
        filter: [{ op: FilterOperators.beginsWith, items: [] }]
      })
      assertType<CountInput>({
        // @ts-expect-error - `items` is not a valid property in this context.
        filter: [{ op: FilterOperators.endsWith, items: [] }]
      })
    })

    it("should disallow number values", () => {
      assertType<CountInput>({
        // @ts-expect-error - a number is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.contains, value: 0 }]
      })
      assertType<CountInput>({
        // @ts-expect-error - a number is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.beginsWith, value: 0 }]
      })
      assertType<CountInput>({
        // @ts-expect-error - a number is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.endsWith, value: 0 }]
      })
    })

    it("should disallow null values", () => {
      assertType<CountInput>({
        // @ts-expect-error - `null` is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.contains, value: null }]
      })
      assertType<CountInput>({
        // @ts-expect-error - `null` is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.beginsWith, value: null }]
      })
      assertType<CountInput>({
        // @ts-expect-error - `null` is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.endsWith, value: null }]
      })
    })

    it("should disallow boolean values", () => {
      assertType<CountInput>({
        // @ts-expect-error - a boolean is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.contains, value: true }]
      })
      assertType<CountInput>({
        // @ts-expect-error - a boolean is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.beginsWith, value: true }]
      })
      assertType<CountInput>({
        // @ts-expect-error - a boolean is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.endsWith, value: true }]
      })
    })
  })

  describe("existence", () => {
    it("should allow valid properties", () => {
      assertType<CountInput>({
        filter: [{ field: "id", op: FilterOperators.exist }]
      })
      assertType<CountInput>({
        filter: [{ field: "id", op: FilterOperators.notExist }]
      })
    })

    it("should disallow invalid properties", () => {
      assertType<CountInput>({
        // @ts-expect-error - `value` is not a valid property in this context.
        filter: [{ op: FilterOperators.exist, value: "test" }]
      })
      assertType<CountInput>({
        // @ts-expect-error - `value` is not a valid property in this context.
        filter: [{ op: FilterOperators.notExist, value: "test" }]
      })
    })
  })

  describe("set", () => {
    it("should allow valid properties", () => {
      assertType<CountInput>({
        filter: [{ field: "id", op: FilterOperators.in, value: [0] }]
      })
      assertType<CountInput>({
        filter: [{ field: "id", op: FilterOperators.notIn, value: [0] }]
      })
    })

    it("should disallow invalid properties", () => {
      assertType<CountInput>({
        // @ts-expect-error - `items` is not a valid property in this context.
        filter: [{ op: FilterOperators.in, items: [] }]
      })
      assertType<CountInput>({
        // @ts-expect-error - `items` is not a valid property in this context.
        filter: [{ op: FilterOperators.notIn, items: [] }]
      })
    })

    it("should disallow non-array values", () => {
      assertType<CountInput>({
        // @ts-expect-error - a number is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.in, value: 0 }]
      })
      assertType<CountInput>({
        // @ts-expect-error - a number is not a valid value in this context.
        filter: [{ field: "id", op: FilterOperators.notIn, value: 0 }]
      })
    })
  })
})

describe("query input", () => {
  it("should allow any IncludeFields for untyped queries", () => {
    assertType<QueryInput>({
      filter: [],
      IncludeFields: ["id", "companyName", "Test"]
    })
  })

  it("should allow valid IncludeFields for typed queries", () => {
    assertType<QueryInput<Company>>({
      filter: [],
      IncludeFields: ["id", "companyName", "Test"]
    })
  })

  it("should not allow invalid IncludeFields for typed queries", () => {
    assertType<QueryInput<Company>>({
      filter: [],
      // @ts-expect-error - `invalid` value is not allowed
      IncludeFields: ["id", "companyName", "Test", "invalid"]
    })
  })
})

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

describe("entity methods", () => {
  describe("query", () => {
    it("should return query response for untyped requests", () => {
      expectTypeOf(
        api.Companies.query
      ).returns.resolves.toEqualTypeOf<QueryResponse>()
    })

    it("should return typed query response for typed requests", () => {
      expectTypeOf(api.Companies.query<Company>).returns.resolves.toEqualTypeOf<
        QueryResponse<Company>
      >()
    })

    it("should disallow parameters for Modules entity", () => {
      expectTypeOf(api.Modules.query).parameters.toEqualTypeOf<[]>()
    })
  })

  describe("count", () => {
    it("should match the expected function type", () => {
      assertType<(query: CountInput) => Promise<CountResponse>>(
        api.Companies.count
      )
    })
  })

  describe("get", () => {
    it("should return get response for untyped requests", () => {
      expectTypeOf(
        api.Companies.get
      ).returns.resolves.toEqualTypeOf<GetResponse>()
    })

    it("should return typed get response for typed requests", () => {
      const request = api.Companies.get<Company>(0)
      expectTypeOf(request).resolves.toEqualTypeOf<GetResponse<Company>>()
    })

    it("should only require one parameter for normal entities", () => {
      expectTypeOf(api.Companies.get).parameters.toEqualTypeOf<[number]>()
    })

    it("should require two parameters for attachment entities", () => {
      expectTypeOf(
        api.ConfigurationItemAttachments.get
      ).parameters.toEqualTypeOf<[number, number]>()
    })

    it("should not allow parameters for the Modules entity", () => {
      expectTypeOf(api.Modules.get).parameters.toEqualTypeOf<[]>()
    })
  })

  describe("update", () => {
    it("should return update response for requests", () => {
      expectTypeOf(
        api.Companies.update
      ).returns.resolves.toEqualTypeOf<UpdateResponse>()
    })

    it("should only require one parameter for normal entities", () => {
      assertType<
        (toSave: Entity, opts?: RequestOptions) => Promise<UpdateResponse>
      >(api.Companies.update)
    })

    it("should require two parameters for child entities", () => {
      assertType<
        (
          parentId: number,
          toSave: Entity,
          opts?: RequestOptions
        ) => Promise<UpdateResponse>
      >(api.ConfigurationItemAttachments.update)
    })
  })

  describe("create", () => {
    it("should only require one parameter for normal entities", () => {
      assertType<
        (toSave: Entity, opts?: RequestOptions) => Promise<CreateResponse>
      >(api.Companies.create)
    })

    it("should require two parameters for child entities", () => {
      assertType<
        (
          parentId: number,
          toSave: Entity,
          opts?: RequestOptions
        ) => Promise<CreateResponse>
      >(api.ConfigurationItemAttachments.create)
    })
  })

  describe("delete", () => {
    it("should only require one parameter for normal entities", () => {
      assertType<(id: number) => Promise<DeleteResponse>>(api.Companies.delete)
    })

    it("should require two parameters for child entities", () => {
      assertType<(parentId: number, id: number) => Promise<DeleteResponse>>(
        api.ConfigurationItemAttachments.delete
      )
    })
  })

  describe("replace", () => {
    it("should only require two parameters for normal entities", () => {
      assertType<
        (toSave: Entity, opts?: RequestOptions) => Promise<UpdateResponse>
      >(api.Companies.replace)
    })

    it("should require three parameters for child entities", () => {
      assertType<
        (
          parentId: number,
          toSave: Entity,
          opts?: RequestOptions
        ) => Promise<UpdateResponse>
      >(api.ConfigurationItemAttachments.replace)
    })
  })

  describe("info", () => {
    it("should match the expected function type", () => {
      assertType<() => Promise<InfoResponse>>(api.Companies.info)
    })
  })

  describe("field info", () => {
    it("should match the expected function type", () => {
      assertType<() => Promise<FieldInfoResponse>>(api.Companies.fieldInfo)
    })
  })

  describe("user-defined field info", () => {
    it("should match the expected function type", () => {
      assertType<() => Promise<UdfInfoResponse>>(api.Companies.udfInfo)
    })
  })
})
