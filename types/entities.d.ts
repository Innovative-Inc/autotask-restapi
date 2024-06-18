import { ArrayValues } from "type-fest"

import {
  CreateInput,
  CreateResponse,
  DeleteResponse,
  EditInput,
  ReplaceResponse,
  UpdateResponse
} from "./crud"
import {
  AttachmentEntity,
  AvailableEntities,
  IsSpecialEntity
} from "./entity-definitions"
import { FieldInfoResponse, InfoResponse, UdfInfoResponse } from "./info"
import {
  CountInput,
  CountResponse,
  GetResponse,
  QueryAllPageResponse,
  QueryAllResponse,
  QueryInput,
  QueryResponse
} from "./query"

export type Entity = ArrayValues<AvailableEntities>["type"]

export type RequestOptions = {
  omit_credentials?: boolean
  ImpersonationResourceId?: string
}

/** The entities and their methods for interacting with the Autotask REST API. */
export type EntityMethods = {
  [T in AvailableEntities[number] as T["name"]]: {
    /** The name of this entity's parent entity, if it has one. */
    parent: T extends { childOf: string } ? T["childOf"] : undefined
    /** Whether this entity is a child of another entity. */
    isChild: T extends { childOf: string } ? true : false
    // methods
    /**
     * Query available entities.
     *
     * @example - The return type can be specified by:
     *
     * ```ts
     * await client.Companies.query<{ id: number, name: string }>(...)
     * ```
     *
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Basic_Query_Calls.htm
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Advanced_Query_Features.htm
     */
    query: IsSpecialEntity<T> extends true
      ? // Don't wrap with a query response.
        () => Promise<Required<T["type"]>>
      : <Q extends QueryInput<T["type"]>>(
          query: Q
        ) => Promise<QueryResponse<T["type"], Q>>
    /**
     * Query all available entities for a given query, traversing pagination
     * where necessary.
     *
     * @example The return type can be specified by:
     *
     * ```ts
     * client.Companies.queryAll<{ id: number, companyName: string }>(...)
     * ```
     *
     * @example Yield each **item** in a query:
     *
     * ```ts
     * for await (const company of client.Companies.queryAll(...)) {
     *   // do something with the company
     * }
     * ```
     *
     * @example Yield each **page** in a query:
     *
     * ```ts
     * for await (const page of client.Companies.queryAll(..., true)) {
     *   // do something with the page of companies
     * }
     * ```
     *
     * @param yieldPages If true, yields pages of items instead of individual
     *   items. Defaults to false.
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Advanced_Query_Features.htm
     */
    queryAll: IsSpecialEntity<T> extends true
      ? never
      : <Q extends QueryInput<T["type"]>, Y extends boolean = false>(
          query: Q,
          yieldPages?: Y
        ) => Y extends true
          ? QueryAllPageResponse<T["type"], Q>
          : QueryAllResponse<T["type"], Q>
    /**
     * Count available entities.
     *
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Advanced_Query_Features.htm
     */
    count: (query: CountInput<T["type"]>) => Promise<CountResponse>
    /**
     * Get a specific entity.
     *
     * @example - The return type can be specified by: client.Companies.query<{
     * id: number, name: string }>(...)
     *
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Basic_Query_Calls.htm
     */
    get: IsSpecialEntity<T> extends true
      ? // Don't wrap with a get response.
        () => Promise<T["type"]>
      : T["name"] extends AttachmentEntity
        ? <R extends T["type"] = T["type"]>(
            parentId: number,
            id: number
          ) => Promise<GetResponse<R>>
        : <R extends T["type"] = T["type"]>(
            id: number
          ) => Promise<GetResponse<R>>
    /**
     * Update a specific entity. Fields omitted from the payload will **not** be
     * cleared in Autotask.
     *
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Updating_Data_PATCH.htm
     */
    update: T extends { childOf: string }
      ? (
          parentId: number,
          toSave: EditInput<T["type"]>,
          opts?: RequestOptions
        ) => Promise<UpdateResponse>
      : (
          toSave: EditInput<T["type"]>,
          opts?: RequestOptions
        ) => Promise<UpdateResponse>
    /**
     * Create a new entity.
     *
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Creating_Resources_POST.htm
     */
    create: T extends { childOf: string }
      ? (
          parentId: number,
          toSave: CreateInput<T["type"]>,
          opts?: RequestOptions
        ) => Promise<CreateResponse>
      : (
          toSave: CreateInput<T["type"]>,
          opts?: RequestOptions
        ) => Promise<CreateResponse>
    /**
     * Delete a specific entity.
     *
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Delete_Operation.htm
     */
    delete: T extends { childOf: string }
      ? (parentId: number, id: number) => Promise<DeleteResponse>
      : (id: number) => Promise<DeleteResponse>
    /**
     * Replace an entity. Fields omitted from the payload **will** be cleared in
     * Autotask.
     *
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Updating_Data_PUT.htm
     */
    replace: T extends { childOf: string }
      ? (
          parentId: number,
          toSave: EditInput<T["type"]>,
          opts?: RequestOptions
        ) => Promise<ReplaceResponse>
      : (
          toSave: EditInput<T["type"]>,
          opts?: RequestOptions
        ) => Promise<ReplaceResponse>
    /**
     * Get info about the entity.
     *
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Resource_Child_Access_URLs.htm
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_EntityInformationCall.htm
     */
    info: () => Promise<InfoResponse>
    /**
     * Get info about the entity's fields.
     *
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Resource_Child_Access_URLs.htm
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_EntityInformationCall.htm
     */
    fieldInfo: () => Promise<FieldInfoResponse>
    /**
     * Get info about the entity's user-defined fields.
     *
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Resource_Child_Access_URLs.htm
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_EntityInformationCall.htm
     */
    udfInfo: () => Promise<UdfInfoResponse>
  }
}
