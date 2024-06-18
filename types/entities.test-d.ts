import { assertType, describe, expectTypeOf } from "vitest"

import { AutotaskRestApi, RequestOptions } from "../index"
import {
  ModuleAccessResult,
  ThresholdStatusResult,
  ZoneInformationResult
} from "../vendor/openapi-entity-types"
import { MutateResponse } from "./crud"
import { FieldInfoResponse, InfoResponse, UdfInfoResponse } from "./info"
import { CountResponse } from "./query"

const api = new AutotaskRestApi("", "", "")

type PageItems<T> = { items: T[] }

describe("query", () => {
  it("should return specific result for special entities", () => {
    assertType<Promise<ModuleAccessResult>>(api.Modules.query())
    assertType<Promise<ThresholdStatusResult>>(api.ThresholdInformation.query())
    assertType<Promise<ZoneInformationResult>>(api.ZoneInformation.query())
  })

  it("should disallow args for special entities", () => {
    expectTypeOf(api.Modules.query).parameters.toEqualTypeOf<[]>()
    expectTypeOf(api.ThresholdInformation.query).parameters.toEqualTypeOf<[]>()
    expectTypeOf(api.ZoneInformation.query).parameters.toEqualTypeOf<[]>()
  })

  it("should allow filtering by built-in fields", () => {
    assertType<any>(
      api.Companies.query({ filter: [{ field: "id", op: "eq", value: 0 }] })
    )
  })

  it("should allow filtering by user-defined fields on supported entities", () => {
    assertType<any>(
      api.Companies.query({
        filter: [{ field: "test", op: "eq", value: "test" }]
      })
    )
    assertType<any>(
      api.ServiceCallTickets.query({
        // @ts-expect-error User-defined fields are not supported on this entity.
        filter: [{ field: "test", op: "eq", value: "test" }]
      })
    )
  })

  it("should return all fields by default", () => {
    type Expect = PageItems<{
      id: number
      serviceCallID: number | null
      ticketID: number | null
    }>

    assertType<Promise<Expect>>(api.ServiceCallTickets.query({ filter: [] }))
  })

  it("should only return specified built-in fields", () => {
    type Expect = PageItems<{
      id: number
      serviceCallID: number | null
    }>

    assertType<Promise<Expect>>(
      api.ServiceCallTickets.query({
        filter: [],
        IncludeFields: ["id", "serviceCallID"]
      })
    )
  })

  it("should only return specified user-defined fields on supported entities", () => {
    type Expect = PageItems<{
      userDefinedFields: { name: "test"; value: string }[]
    }>

    assertType<Promise<Expect>>(
      api.Companies.query({ filter: [], IncludeFields: ["test"] })
    )
    assertType<any>(
      // @ts-expect-error User-defined fields are not supported on this entity.
      api.ServiceCallTickets.query({ filter: [], IncludeFields: ["test"] })
    )
  })

  it("should only return specified built-in and user-defined fields", () => {
    type Expect = PageItems<{
      id: number
      companyName: string | null
      userDefinedFields: { name: "test"; value: string }[]
    }>

    assertType<Promise<Expect>>(
      api.Companies.query({
        filter: [],
        IncludeFields: ["id", "companyName", "test"]
      })
    )
  })
})

describe("query all", () => {
  it("should disallow special entities", () => {
    // @ts-expect-error Special entities are not supported.
    assertType<any>(api.Modules.queryAll())
    // @ts-expect-error Special entities are not supported.
    assertType<any>(api.ThresholdInformation.queryAll())
    // @ts-expect-error Special entities are not supported.
    assertType<any>(api.ZoneInformation.queryAll())
  })

  it("should allow filtering by built-in fields", () => {
    assertType<any>(
      api.Companies.queryAll({ filter: [{ field: "id", op: "eq", value: 0 }] })
    )
  })

  it("should allow filtering by user-defined fields on supported entities", () => {
    assertType<any>(
      api.Companies.queryAll({
        filter: [{ field: "test", op: "eq", value: "test" }]
      })
    )
    assertType<any>(
      api.ServiceCallTickets.queryAll({
        // @ts-expect-error User-defined fields are not supported on this entity.
        filter: [{ field: "test", op: "eq", value: "test" }]
      })
    )
  })

  it("should return all fields by default", () => {
    type Expect = {
      id: number
      serviceCallID: number | null
      ticketID: number | null
    }

    assertType<AsyncIterableIterator<Expect>>(
      api.ServiceCallTickets.queryAll({ filter: [] })
    )
    assertType<AsyncIterableIterator<PageItems<Expect>>>(
      api.ServiceCallTickets.queryAll({ filter: [] }, true)
    )
  })

  it("should only return specified built-in fields", () => {
    type Expect = {
      id: number
      serviceCallID: number | null
    }

    assertType<AsyncIterableIterator<Expect>>(
      api.ServiceCallTickets.queryAll({
        filter: [],
        IncludeFields: ["id", "serviceCallID"]
      })
    )
    assertType<AsyncIterableIterator<PageItems<Expect>>>(
      api.ServiceCallTickets.queryAll(
        { filter: [], IncludeFields: ["id", "serviceCallID"] },
        true
      )
    )
  })

  it("should only return specified user-defined fields on supported entities", () => {
    type Expect = {
      userDefinedFields: { name: "test"; value: string }[]
    }

    assertType<AsyncIterableIterator<Expect>>(
      api.Companies.queryAll({ filter: [], IncludeFields: ["test"] })
    )
    assertType<AsyncIterableIterator<PageItems<Expect>>>(
      api.Companies.queryAll({ filter: [], IncludeFields: ["test"] }, true)
    )
    assertType<any>(
      // @ts-expect-error User-defined fields are not supported on this entity.
      api.ServiceCallTickets.queryAll({ filter: [], IncludeFields: ["test"] })
    )
    assertType<any>(
      api.ServiceCallTickets.queryAll(
        // @ts-expect-error User-defined fields are not supported on this entity.
        { filter: [], IncludeFields: ["test"] },
        true
      )
    )
  })

  it("should only return specified built-in and user-defined fields", () => {
    type Expect = {
      id: number
      companyName: string | null
      userDefinedFields: { name: "test"; value: string }[]
    }

    assertType<AsyncIterableIterator<Expect>>(
      api.Companies.queryAll({
        filter: [],
        IncludeFields: ["id", "companyName", "test"]
      })
    )
    assertType<AsyncIterableIterator<PageItems<Expect>>>(
      api.Companies.queryAll(
        { filter: [], IncludeFields: ["id", "companyName", "test"] },
        true
      )
    )
  })
})

describe("count", () => {
  it("should allow filtering by built-in fields", () => {
    assertType<any>(
      api.Companies.count({ filter: [{ field: "id", op: "eq", value: 0 }] })
    )
  })

  it("should allow filtering by user-defined fields on supported entities", () => {
    assertType<any>(
      api.Companies.count({
        filter: [{ field: "test", op: "eq", value: "test" }]
      })
    )
    assertType<any>(
      api.ServiceCallTickets.count({
        // @ts-expect-error User-defined fields are not supported on this entity.
        filter: [{ field: "test", op: "eq", value: "test" }]
      })
    )
  })

  it("should return the count of entities", () => {
    assertType<Promise<CountResponse>>(api.Companies.count({ filter: [] }))
  })
})

describe("get", () => {
  type ExpectItem<T> = { item: T | null }

  it("should not allow parameters for special entities", () => {
    expectTypeOf(api.Modules.get).parameters.toEqualTypeOf<[]>()
    expectTypeOf(api.ThresholdInformation.get).parameters.toEqualTypeOf<[]>()
    expectTypeOf(api.ZoneInformation.get).parameters.toEqualTypeOf<[]>()
  })

  it("should require two parameters for attachment entities", () => {
    expectTypeOf(api.ConfigurationItemAttachments.get).parameters.toEqualTypeOf<
      [number, number]
    >()
  })

  it("should require one parameter for normal entities", () => {
    expectTypeOf(api.Companies.get).parameters.toEqualTypeOf<[number]>()
  })

  it("should return all fields", () => {
    type Expect = ExpectItem<{
      id: number
      companyName: string | null
    }>

    assertType<Promise<Expect>>(api.Companies.get(0))
  })
})

describe("update", () => {
  it("should require two parameters for attachment entities", () => {
    type Expect = (
      parentId: number,
      toSave: { id: number },
      opts?: RequestOptions
    ) => Promise<MutateResponse>

    assertType<Expect>(api.ConfigurationItemAttachments.update)
  })

  it("should require one parameter for normal entities", () => {
    type Expect = (
      toSave: { id: number },
      opts?: RequestOptions
    ) => Promise<MutateResponse>

    assertType<Expect>(api.Companies.update)
  })

  it("should return the update response", () => {
    assertType<Promise<MutateResponse>>(api.Companies.update({ id: 0 }))
  })

  it("should require the id field", () => {
    assertType<Promise<MutateResponse>>(api.Companies.update({ id: 0 }))
    assertType<Promise<MutateResponse>>(
      // @ts-expect-error ID is required.
      api.Companies.update({ companyName: "test" })
    )
  })
})

describe("create", () => {
  it("should require two parameters for child entities", () => {
    type Expect = (
      parentId: number,
      toSave: {},
      opts?: RequestOptions
    ) => Promise<MutateResponse>

    assertType<Expect>(api.ConfigurationItemAttachments.create)
  })

  it("should require one parameter for normal entities", () => {
    type Expect = (toSave: {}, opts?: RequestOptions) => Promise<MutateResponse>

    assertType<Expect>(api.Companies.create)
  })

  it("should return the create response", () => {
    assertType<Promise<MutateResponse>>(api.Companies.create({}))
  })

  it("should not allow the id field", () => {
    assertType<Promise<MutateResponse>>(
      api.Companies.create({ companyName: "test" })
    )
    // @ts-expect-error ID is not allowed.
    assertType<Promise<ExpectResponse>>(api.Companies.create({ id: 0 }))
  })
})

describe("delete", () => {
  it("should require two parameters for child entities", () => {
    assertType<(parentId: number, id: number) => Promise<MutateResponse>>(
      api.ConfigurationItemAttachments.delete
    )
  })

  it("should require one parameter for normal entities", () => {
    assertType<(id: number) => Promise<MutateResponse>>(api.Companies.delete)
  })

  it("should return the delete response", () => {
    assertType<Promise<MutateResponse>>(api.Companies.delete(0))
  })
})

describe("replace", () => {
  it("should require two parameters for child entities", () => {
    type Expect = (
      parentId: number,
      toSave: { id: number },
      opts?: RequestOptions
    ) => Promise<MutateResponse>

    assertType<Expect>(api.ConfigurationItemAttachments.replace)
  })

  it("should require one parameter for normal entities", () => {
    type Expect = (
      toSave: { id: number },
      opts?: RequestOptions
    ) => Promise<MutateResponse>

    assertType<Expect>(api.Companies.replace)
  })

  it("should return the update response", () => {
    assertType<Promise<MutateResponse>>(api.Companies.replace({ id: 0 }))
  })

  it("should require the id field", () => {
    assertType<Promise<MutateResponse>>(api.Companies.replace({ id: 0 }))
    assertType<Promise<MutateResponse>>(
      // @ts-expect-error ID is required.
      api.Companies.replace({ companyName: "test" })
    )
  })
})

describe("entity info", () => {
  it("should return the entity info", () => {
    assertType<Promise<InfoResponse>>(api.Companies.info())
  })
})

describe("field info", () => {
  it("should return the field info", () => {
    assertType<Promise<FieldInfoResponse>>(api.Companies.fieldInfo())
  })
})

describe("user-defined field info", () => {
  it("should return the user-defined field info", () => {
    assertType<Promise<UdfInfoResponse>>(api.Companies.udfInfo())
  })
})
