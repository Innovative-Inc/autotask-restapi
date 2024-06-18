import type { JsonObject } from "type-fest"

import { AvailableEntities, EntityMethods } from "./types"
import { ZoneInformationResult } from "./vendor/openapi-entity-types"

export * from "./types"

export type RequestOptions = {
  omit_credentials?: boolean
  ImpersonationResourceId?: string
}

/**
 * Autotask REST API NodeJS connector.
 *
 * This class provides a simple interface to the Autotask REST API.
 */
declare class AutotaskRestApi {
  readonly user: string
  readonly secret: string
  readonly code: string
  readonly base_url: string
  readonly version: string

  readonly zoneInfo: null | ZoneInformationResult
  readonly available_entities: AvailableEntities

  constructor(
    apiKey: string,
    apiSecret: string,
    trackingIdentifier: string,
    options?: {
      base_url?: string
      version?: string
    }
  )

  /** Lookup/query an entity */
  _get(): Promise<JsonObject>
  /** Delete an entity */
  _delete(): Promise<JsonObject>
  /** Sparse update an entity */
  _patch(): Promise<JsonObject>
  /** Full update an entity */
  _put(): Promise<JsonObject>
  /** Create an entity */
  _post(): Promise<JsonObject>

  /**
   * Handles HTTP API calls.
   *
   * @param method GET, POST, PUT, PATCH or DELETE
   * @param endpoint Beginning with a / appended to the base url
   * @param query Hash of query parameters, if applicable
   * @param payload To be converted to JSON, if provided
   * @param opts Additional options (typically omitted)
   * @param opts.omit_credentials Omits the credentials on the request.
   * @param opts.ImpersonationResourceId Specifies an Autotask Resource ID to
   *   impersonate on a create/update operation
   */
  _fetch(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    endpoint: string,
    query?: JsonObject,
    payload?: JsonObject,
    opts?: RequestOptions
  ): Promise<JsonObject>
}

interface AutotaskRestApi extends EntityMethods {}

export { AutotaskRestApi }

/**
 * Extends errors, allow you to parse HTTP status and get details about REST API
 * errors.
 */
export class AutotaskApiError extends Error {
  readonly status: number
  readonly details: JsonObject | string

  constructor(message: string, status: number, details: JsonObject | string)
}

interface FilterOperators {
  /** Requires that the field value match the exact criteria provided */
  eq: "eq"
  /** Requires that the field value be anything other than the criteria provided */
  noteq: "noteq"
  /** Requires that the field value be greater than the criteria provided */
  gt: "gt"
  /**
   * Requires that the field value be greater than or equal to the criteria
   * provided
   */
  gte: "gte"
  /** Requires that the field value be less than the criteria provided */
  lt: "lt"
  /**
   * Requires that the field value be less than or equal to the criteria
   * provided
   */
  lte: "lte"
  /** Requires that the field value begin with the defined criteria */
  beginsWith: "beginsWith"
  /** Requires that the field value end with the defined criteria */
  endsWith: "endsWith"
  /**
   * Allows for the string provided as criteria to match any resource that
   * contains the string in its value
   */
  contains: "contains"
  /** Enter exist to query for fields in which the data you specify is not null. */
  exist: "exist"
  /** Enter notExist to query for fields in which the specified data is null */
  notExist: "notExist"
  /**
   * With this value specified, the query will return only the values in the
   * list array that match the field value you specify
   */
  in: "in"
  /**
   * With this value specified, the query will only return the values in the
   * list array that do not match the field value you specify
   */
  notIn: "notIn"
}
// @ts-expect-error Assignment is required for Prettier.
export const FilterOperators: FilterOperators = FilterOperators
