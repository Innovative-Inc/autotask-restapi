import {
  ArrayValues,
  EmptyObject,
  OptionalKeysOf,
  Simplify,
  SimplifyDeep
} from "type-fest"

import { UserDefinedField } from "../vendor/openapi-entity-types"
import { Entity } from "./entities"
import { AllFields, FilterInput, HasUdf } from "./filters"

/**
 * A filter to apply to a query.
 *
 * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Advanced_Query_Features.htm
 */
export type CountInput<T extends Entity> = FilterInput<T>
/**
 * A filter and additional operators to apply to a query.
 *
 * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Basic_Query_Calls.htm
 * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Advanced_Query_Features.htm
 */
export type QueryInput<T extends Entity> = FilterInput<T> & {
  /** The built-in and user-defined fields to include in the query results. */
  IncludeFields?: AllFields<T>[]
  /** The maximum number of records to return in the query results. */
  MaxRecords?: number
}

/**
 * Build an entity type using the base entity (T) and a list of fields (F). Any
 * fields not present in the base entity will be added as user-defined fields.
 */
export type EntityFromFilter<
  T extends Entity,
  Q extends QueryInput<T>
> = Q extends { IncludeFields: string[] }
  ? {
      [K in Extract<
        ArrayValues<Q["IncludeFields"]>,
        keyof T
      >]?: K extends keyof T ? T[K] : never
    } & (HasUdf<T> extends true
      ? {
          userDefinedFields?: UserDefinedField<
            Exclude<ArrayValues<Q["IncludeFields"]>, keyof T>
          >[]
        }
      : {})
  : T

export type ResultFromEntity<T extends Entity> = Simplify<
/** Build a result from an entity. */
  (T extends { id?: any } ? Required<Pick<T, "id">> : {}) &
    (T extends { userDefinedFields?: any[] }
      ? // UDF property is always included even if `IncludeFields` is set to only
        // built-in fields.
        Required<Pick<T, "userDefinedFields">>
      : {}) &
    Omit<T, OptionalKeysOf<T> | "userDefinedFields" | "id"> & {
      [Key in keyof Pick<T, OptionalKeysOf<T>>]-?: T[Key] | null
    }
>

export type ResultFromFilter<
/** Build a result from a filter. */
  T extends Entity,
  Q extends QueryInput<T>
> = ResultFromEntity<EntityFromFilter<T, Q>>

/**
 * The response from a query operation.
 *
 * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Basic_Query_Calls.htm
 */
export type QueryResponse<
  T extends Entity,
  Q extends QueryInput<T>
> = SimplifyDeep<{
  items: ResultFromFilter<T, Q>[]
  pageDetails: {
    count: number
    requestCount: number
    prevPageUrl: null | string
    nextPageUrl: null | string
  }
}>
/**
 * The response from a query that iterates all entities across pages.
 *
 * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Advanced_Query_Features.htm
 */
export type QueryAllResponse<
  T extends Entity,
  Q extends QueryInput<T>
> = AsyncIterableIterator<ResultFromFilter<T, Q>>
/**
 * The response from a query that iterates all pages.
 *
 * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Advanced_Query_Features.htm
 */
export type QueryAllPageResponse<
  T extends Entity,
  Q extends QueryInput<T>
> = AsyncIterableIterator<QueryResponse<T, Q>>
/**
 * The response from a count operation.
 *
 * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Advanced_Query_Features.htm
 */
export type CountResponse = { queryCount: number }
/**
 * The response from a get operation.
 *
 * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Basic_Query_Calls.htm
 */
export type GetResponse<T extends Entity> = {
  item: ResultFromEntity<T> | null
}
