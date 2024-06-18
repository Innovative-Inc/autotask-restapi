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

export type CountInput<T extends Entity> = FilterInput<T>
export type QueryInput<T extends Entity> = FilterInput<T> & {
  /**
   * The resource fields to include in the query results. If provided, it
   * **must** includes all built-in and user-defined fields specified in the
   * entity type.
   *
   * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Advanced_Query_Features.htm
   */
  IncludeFields?: AllFields<T>[]
  /**
   * The maximum number of records to return in the query results.
   *
   * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Advanced_Query_Features.htm
   */
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

/** Make optional keys of an object required and nullable. */
export type ResultFromEntity<T extends Entity> = Simplify<
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
  T extends Entity,
  Q extends QueryInput<T>
> = ResultFromEntity<EntityFromFilter<T, Q>>

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
export type QueryAllResponse<
  T extends Entity,
  Q extends QueryInput<T>
> = AsyncIterableIterator<ResultFromFilter<T, Q>>
export type QueryAllPageResponse<
  T extends Entity,
  Q extends QueryInput<T>
> = AsyncIterableIterator<QueryResponse<T, Q>>
export type CountResponse = { queryCount: number }
export type GetResponse<T extends Entity> = {
  item: ResultFromEntity<T> | null
}
