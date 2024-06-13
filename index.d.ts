import type {JsonObject, JsonPrimitive, OptionalKeysOf, ValueOf} from "type-fest"

export type RequestOptions = {
  omit_credentials?: boolean
  ImpersonationResourceId?: string
}

// Special entities
type ModulesEntity = "Modules"
type AttachmentEntity =
  | "ConfigurationItemAttachments"
  | "ConfigurationItemNoteAttachments"
  | "OpportunityAttachments"
  | "TaskAttachments"
  | "TaskNoteAttachments"
  | "TicketAttachments"
  | "TicketNoteAttachments"
  | "TimeEntryAttachments"

// entity
type UserDefinedField<Name extends string = string> = {
  name: Name
  value: string
}
export type Entity = {
  [key: string]: JsonPrimitive | UserDefinedField[] | undefined
  userDefinedFields?: UserDefinedField[]
}

// filtering & search
type FilterInput = {
  /**
   * The filter expression to apply to the query.
   *
   * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Basic_Query_Calls.htm
   */
  filter: FilterExpression[]
}
export type CountInput = FilterInput

/** Combine normal and user-defined fields into a flat union. */
type FieldsFromEntity<T extends Entity> =
  | Exclude<keyof T, "userDefinedFields">
  | (T["userDefinedFields"] extends UserDefinedField[]
  ? T["userDefinedFields"][number]["name"]
  : never)

export type QueryInput<T extends Entity = Entity> = FilterInput & {
  /**
   * The resource fields to include in the query results. If provided, it
   * **must** includes all built-in and user-defined fields specified in the
   * entity type.
   *
   * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Advanced_Query_Features.htm
   */
  IncludeFields?: FieldsFromEntity<Omit<T, OptionalKeysOf<T>>>[]
  /**
   * The maximum number of records to return in the query results.
   *
   * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Advanced_Query_Features.htm
   */
  MaxRecords?: number
}
// filter expressions
type GroupingOperator = "and" | "or"
type EqualityOperator = ValueOf<Pick<FilterOperators, "eq" | "noteq">>
type ExistenceOperator = ValueOf<
  Pick<FilterOperators, "exist" | "notExist">
>
type SetOperator = ValueOf<Pick<FilterOperators, "in" | "notIn">>
type StringOperator = ValueOf<
  Pick<FilterOperators, "beginsWith" | "endsWith" | "contains">
>
type ComparisonOperator = ValueOf<
  Pick<FilterOperators, "gt" | "gte" | "lt" | "lte">
>
type FilterExpression =
  | { op: GroupingOperator; items: FilterExpression[] }
  | { op: EqualityOperator; field: string; value: JsonPrimitive }
  // string needs to be supported for all comparison operators to allow for
  // datetime string comparisons
  | { op: ComparisonOperator; field: string; value: string | number }
  | { op: StringOperator; field: string; value: string }
  | { op: ExistenceOperator; field: string }
  | { op: SetOperator; field: string; value: JsonPrimitive[] }

// read and CRUD responses
export type QueryResponse<T extends Entity = Entity> = {
  items: T[]
  pageDetails: {
    count: number
    requestCount: number
    prevPageUrl: null | string
    nextPageUrl: null | string
  }
}
export type CountResponse = { queryCount: number }
export type GetResponse<T extends Entity = Entity> = { item: T | null }
export type UpdateResponse = { itemId: number }
export type CreateResponse = { itemId: number }
export type DeleteResponse = { itemId: number }
export type ReplaceResponse = { itemId: number }

// info response
type UserAccess = "None" | "All" | "Restricted"
/**
 * Info regarding the queried entity.
 *
 * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_EntityInformationCall.htm
 */
export type InfoResponse = {
  info: {
    name: string
    canCreate: boolean
    canDelete: boolean
    canQuery: boolean
    canUpdate: boolean
    userAccessForCreate: UserAccess
    userAccessForDelete: UserAccess
    userAccessForQuery: UserAccess
    userAccessForUpdate: UserAccess
    hasUserDefinedFields: boolean
    supportsWebhookCallouts: boolean
  }
}

// shared field and UDF info response utils
type SharedPicklistValues = {
  value: string
  label: string
  isDefaultValue: boolean
  sortOrder: number
  isActive: boolean
  isSystem: boolean
}
// `NullishValue` generic type exists because built-in fields and UDFs have
// different values when "null"
type PicklistFieldInfo<NullishValue> =
// normal picklist
  | {
  picklistParentValueField: NullishValue
  // however, it seems that both built-in fields and UDFs have the same
  // `parentValue` value when "null"
  picklistValues: ({ parentValue: "" } & SharedPicklistValues)[]
}
  // child picklist
  | {
  picklistParentValueField: string
  picklistValues: ({ parentValue: string } & SharedPicklistValues)[]
}
type NonPicklistFieldInfo<NullishValue> = {
  picklistValues: null
  picklistParentValueField: NullishValue
}
type ReferenceFieldInfo = { referenceEntityType: string }
type NonReferenceFieldInfo<NullishValue> = {
  referenceEntityType: NullishValue
}

// field info response
type StringFieldInfo = { maxLength: number }
type NonStringFieldInfo = { maxLength: 0 }
export type FieldInfo = {
  name: string
  isRequired: boolean
  isReadOnly: boolean
  isQueryable: boolean
  isSupportedWebhookField: boolean
} & (
  | // normal, non-string field
  ({
    dataType:
      | "boolean"
      | "integer"
      | "long"
      | "double"
      | "decimal"
      | "datetime"
    isPicklist: false
    isReference: false
  } & NonStringFieldInfo &
    NonPicklistFieldInfo<""> &
    NonReferenceFieldInfo<"">)
  // normal string field
  | ({
  dataType: "string"
  isPicklist: false
  isReference: false
} & StringFieldInfo &
  NonPicklistFieldInfo<""> &
  NonReferenceFieldInfo<"">)
  // picklist field
  | ({
  dataType: "integer"
  isPicklist: true
  isReference: false
} & NonStringFieldInfo &
  PicklistFieldInfo<""> &
  NonReferenceFieldInfo<"">)
  // reference field
  | ({
  dataType: "integer"
  isPicklist: false
  isReference: true
} & NonStringFieldInfo &
  NonPicklistFieldInfo<""> &
  ReferenceFieldInfo)
  )
export type FieldInfoResponse = { fields: FieldInfo[] }

// UDF field info response
type StringUdfFieldInfo = { length: number }
type NonStringUdfFieldInfo = { length: 0 }
export type UdfFieldInfo = {
  name: string
  label: string
  description: null | string
  isRequired: boolean
  isReadOnly: boolean
  isQueryable: true
  defaultValue: string
  isSupportedWebhookField: boolean
} & (
  | // normal, non-string field
  ({
    type: "double" | "datetime"
    isPicklist: false
    isReference: false
  } & NonStringUdfFieldInfo &
    NonPicklistFieldInfo<null> &
    NonReferenceFieldInfo<null>)
  // normal string field
  | ({
  type: "string"
  isPicklist: false
  isReference: false
} & StringUdfFieldInfo &
  NonPicklistFieldInfo<null> &
  NonReferenceFieldInfo<null>)
  // picklist field
  | ({
  type: "integer"
  isPicklist: true
  isReference: false
} & NonStringUdfFieldInfo &
  PicklistFieldInfo<null> &
  NonReferenceFieldInfo<null>)
  // reference field
  | ({
  type: "integer"
  isPicklist: false
  isReference: true
} & NonStringUdfFieldInfo &
  NonPicklistFieldInfo<null> &
  ReferenceFieldInfo)
  )
export type UdfInfoResponse = { fields: UdfFieldInfo[] }

type AvailableEntities = [
  { name: "zoneInformation" },
  { name: 'ActionTypes' },
  { name: 'AdditionalInvoiceFieldValues' },
  { name: 'Appointments' },
  { name: 'AttachmentInfo' },
  { name: 'ProjectCharges' },
  { name: 'BillingCodes' },
  { name: 'BillingItems' },
  { name: 'BillingItemApprovalLevels' },
  { name: 'ChangeOrderCharges' },
  { name: 'ChangeRequestLinks' },
  { name: 'ChecklistLibraries' },
  { name: 'ChecklistLibraryChecklistItems', childOf: 'ChecklistLibraries', subname: 'ChecklistItems' },
  { name: 'ClassificationIcons' },
  { name: 'ClientPortalUsers' },
  { name: 'ComanagedAssociations' },
  { name: 'Companies' },
  { name: 'CompanyAlerts', childOf: 'Companies', subname: 'Alerts' },
  { name: 'CompanyAttachments', childOf: 'Companies', subname: 'Attachments' },
  { name: 'CompanyContacts', childOf: 'Companies', subname: 'Contacts' },
  { name: 'CompanyLocations', childOf: 'Companies', subname: 'Locations' },
  { name: 'CompanyNotes', childOf: 'Companies', subname: 'Notes' },
  { name: 'CompanySiteConfigurations', childOf: 'Companies', subname: 'SiteConfigurations' },
  { name: 'CompanyTeams', childOf: 'Companies', subname: 'Teams' },
  { name: 'CompanyToDos', childOf: 'Companies', subname: 'ToDos' },
  { name: 'CompanyWebhooks' },
  { name: 'CompanyWebhookExcludedResources', childOf: 'CompanyWebhooks', subname: 'ExcludedResources' },
  { name: 'CompanyWebhookFields', childOf: 'CompanyWebhooks', subname: 'Fields' },
  { name: 'CompanyWebhookUdfFields', childOf: 'CompanyWebhoosk', subname: 'UdfFields' },
  { name: 'ConfigurationItems' },
  { name: 'ConfigurationItemAttachments', childOf: 'ConfigurationItems', subname: 'Attachments' },
  {
    name: 'ConfigurationItemBillingProductAssociations',
    childOf: 'ConfigurationItems',
    subname: 'BillingProductAssociations'
  },
  { name: 'ConfigurationItemCategories' },
  {
    name: 'ConfigurationItemCategoryUdfAssociations',
    childOf: 'ConfigurationItemCategories',
    subname: 'UdfAssociations'
  },
  { name: 'ConfigurationItemNotes', childOf: 'ConfigurationItems', subname: 'Notes' },
  { name: 'ConfigurationItemNoteAttachments', childOf: 'ConfigurationItemNotes', subname: 'Attachments' },
  { name: 'ConfigurationItemTypes' },
  { name: 'Contacts' },
  { name: 'ContactBillingProductAssociations', childOf: 'Contacts', subname: 'BillingProductAssociationis' },
  { name: 'ContactGroups' },
  { name: 'ContactGroupContacts', childOf: 'ContactGroups', subname: 'Contacts' },
  { name: 'ContactWebhooks' },
  { name: 'ContactWebhookExcludedResources', childOf: 'ContactWebhooks', subname: 'ExcludedResources' },
  { name: 'ContactWebhookFields', childOf: 'ContactWebhooks', subname: 'Fields' },
  { name: 'ContactWebhookUdfFields', childOf: 'ContactWebhooks', subname: 'UdfFields' },
  { name: 'Contracts' },
  { name: 'ContractBillingRules', childOf: 'Contracts', subname: 'BillingRules' },
  { name: 'ContractBlocks', childOf: 'Contracts', subname: 'Blocks' },
  { name: 'ContractBlockHourFactors', childOf: 'Contracts', subname: 'BlockHourFactors' },
  { name: 'ContractCharges', childOf: 'Contracts', subname: 'Charges' },
  { name: 'ContractExclusionBillingCodes', childOf: 'Contracts', subname: 'ExclusionBillingCodes' },
  { name: 'ContractExclusionRoles', childOf: 'Contracts', subname: 'ExclusionRoles' },
  { name: 'ContractExclusionSets' },
  { name: 'ContractExclusionSetExcludedRoles', childOf: 'ContractExclusionSets', subname: 'ExcludedRoles' },
  { name: 'ContractExclusionSetExcludedWorkTypes', childOf: 'ContractExclusionSets', subname: 'ExcludedWorkTypes' },
  { name: 'ContractMilestones', childOf: 'Contracts', subname: 'Milestones' },
  { name: 'ContractNotes', childOf: 'Contracts', subname: 'Notes' },
  { name: 'ContractRates', childOf: 'Contracts', subname: 'Rates' },
  { name: 'ContractRetainers', childOf: 'Contracts', subname: 'Retainers' },
  { name: 'ContractRoleCosts', childOf: 'Contracts', subname: 'RoleCosts' },
  { name: 'ContractServices', childOf: 'Contracts', subname: 'Services' },
  { name: 'ContractServiceAdjustments', childOf: 'Contracts', subname: 'ServiceAdjustments' },
  { name: 'ContractServiceBundles', childOf: 'Contracts', subname: 'ServiceBundles' },
  { name: 'ContractServiceBundleAdjustments', childOf: 'Contracts', subname: 'ServiceBundleAdjustments' },
  { name: 'ContractServiceBundleUnits', childOf: 'Contracts', subname: 'ServiceBundleUnits' },
  { name: 'ContractServiceUnits', childOf: 'Contracts', subname: 'ServiceUnits' },
  { name: 'ContractTicketPurchases', childOf: 'Contracts', subname: 'TicketPurchases' },
  { name: 'Countries' },
  { name: 'Currencies' },
  { name: 'Departments' },
  { name: 'Expenses' },
  { name: 'ExpenseItems', childOf: 'Expenses', subname: 'Items' },
  { name: 'ExpenseReports' },
  { name: 'Holidays', childOf: 'HolidaySets', subname: 'Holidays' },
  { name: 'HolidaySets' },
  { name: 'InternalLocations' },
  { name: 'InternalLocationWithBusinessHours' },
  { name: 'InventoryItems' },
  { name: 'InventoryItemSerialNumbers', childOf: 'InventoryItems', subname: 'SerialNumbers' },
  { name: 'InventoryLocations' },
  { name: 'InventoryTransfers' },
  { name: 'Invoices' },
  { name: 'InvoiceTemplates' },
  { name: 'Modules' },
  { name: 'NotificationHistory' },
  { name: 'Opportunities' },
  { name: 'OpportunityAttachments', childOf: 'Opportunities', subname: 'Attachments' },
  { name: 'OrganizationalLevel1s' },
  { name: 'OrganizationalLevel2s' },
  { name: 'OrganizationalLevelAssociations' },
  { name: 'OrganizationalResources', childOf: 'OrganizationalLevelAssociations', subname: 'Resources' },
  { name: 'PaymentTerms' },
  { name: 'Phases', childOf: 'Projects', subname: 'Phases' },
  { name: 'PriceListMaterialCodes' },
  { name: 'PriceListProducts' },
  { name: 'PriceListProductTiers' },
  { name: 'PriceListRoles' },
  { name: 'PriceListServices' },
  { name: 'PriceListServiceBundles' },
  { name: 'PriceListWorkTypeModifiers' },
  { name: 'Products' },
  { name: 'ProductNotes', childOf: 'Products', subname: 'Notes' },
  { name: 'ProductTiers', childOf: 'Products', subname: 'Tiers' },
  { name: 'ProductVendors', childOf: 'Products', subname: 'Vendors' },
  { name: 'Projects' },
  { name: 'ProjectAttachments', childOf: 'Projects', subname: 'Attachments' },
  { name: 'ProjectCharges', childOf: 'Projects', subname: 'Charges' },
  { name: 'ProjectNotes', childOf: 'Projects', subname: 'Notes' },
  { name: 'PurchaseApprovals' },
  { name: 'PurchaseOrders' },
  { name: 'PurchaseOrderItems', childOf: 'PurchaseOrders', subname: 'Items' },
  { name: 'PurchaseOrderItemReceiving', childOf: 'PurchaseOrderItems', subname: 'Receiving' },
  { name: 'Quotes' },
  { name: 'QuoteItems', childOf: 'Quotes', subname: 'Items' },
  { name: 'QuoteLocations' },
  { name: 'QuoteTemplates' },
  { name: 'Resources' },
  { name: 'ResourceRoles' },
  { name: 'ResourceRoleDepartments', childOf: 'Resources', subname: 'RoleDepartments' },
  { name: 'ResourceRoleQueues', childOf: 'Resources', subname: 'RoleQueues' },
  { name: 'ResourceServiceDeskRoles', childOf: 'Resources', subname: 'ServiceDeskRoles' },
  { name: 'ResourceSkills', childOf: 'Resources', subname: 'Skills' },
  { name: 'Roles' },
  { name: 'SalesOrders', childOf: 'Opportunities', subname: 'SalesOrders' },
  { name: 'Services' },
  { name: 'ServiceBundles' },
  { name: 'ServiceBundleServices', childOf: 'ServiceBundles', subname: 'Services' },
  { name: 'ServiceCalls' },
  { name: 'ServiceCallTasks', childOf: 'ServiceCalls', subname: 'Tasks' },
  { name: 'ServiceCallTaskResources', childOf: 'ServiceCallTasks', subname: 'Resources' },
  { name: 'ServiceCallTickets', childOf: 'ServiceCalls', subname: 'Tickets' },
  { name: 'ServiceCallTicketResources', childOf: 'ServiceCallTickets', subname: 'Resources' },
  { name: 'ServiceLevelAgreementResults', childOf: 'ServiceLevelAgreements', subname: 'Results' },
  { name: 'ShippingTypes' },
  { name: 'Skills' },
  { name: 'Subscriptions' },
  { name: 'SubscriptionPeriods', childOf: 'Subscriptions', subname: 'Periods' },
  { name: 'Surveys' },
  { name: 'SurveyResults' },
  { name: 'Tasks', childOf: 'Projects', subname: 'Tasks' },
  { name: 'TaskAttachments', childOf: 'Tasks', subname: 'Attachments' },
  { name: 'TaskNotes', childOf: 'Tasks', subname: 'Notes' },
  { name: 'TaskNoteAttachments', childOf: 'TaskNotes', subname: 'Attachments' },
  { name: 'TaskPredecessors', childOf: 'Tasks', subname: 'Predecessors' },
  { name: 'TaskSecondaryResources', childOf: 'Tasks', subname: 'SecondaryResources' },
  { name: 'Taxes' },
  { name: 'TaxCategories' },
  { name: 'TaxRegions' },
  { name: 'ThresholdInformation' },
  { name: 'Tickets' },
  { name: 'TicketAdditionalConfigurationItems', childOf: 'Tickets', subname: 'AdditionalConfigurationItems' },
  { name: 'TicketAdditionalContacts', childOf: 'Tickets', subname: 'AdditionalContacts' },
  { name: 'TicketAttachments', childOf: 'Tickets', subname: 'Attachments' },
  { name: 'TicketCategories' },
  { name: 'TicketCategoryFieldDefaults', childOf: 'TicketCategories', subname: 'FieldDefaults' },
  { name: 'TicketChangeRequestApprovals', childOf: 'Tickets', subname: 'ChangeRequestApprovals' },
  { name: 'TicketCharges', childOf: 'Tickets', subname: 'Charges' },
  { name: 'TicketChecklistItems', childOf: 'Tickets', subname: 'ChecklistItems' },
  { name: 'TicketChecklistLibraries', childOf: 'Tickets', subname: 'ChecklistLibraries' },
  { name: 'TicketHistory' },
  { name: 'TicketNotes', childOf: 'Tickets', subname: 'Notes' },
  { name: 'TicketNoteAttachments', childOf: 'TicketNotes', subname: 'Attachments' },
  { name: 'TicketRmaCredits', childOf: 'Tickets', subname: 'RmaCredits' },
  { name: 'TicketSecondaryResources', childOf: 'Tickets', subname: 'SecondaryResources' },
  { name: 'TimeEntries' },
  { name: 'TimeEntryAttachments', childOf: 'TimeEntries', subname: 'Attachments' },
  { name: 'TimeOffRequestsApprove', childOf: 'TimeOffRequests', subname: 'Approve' },
  { name: 'TimeOffRequests' },
  { name: 'TimeOffRequestsReject', childOf: 'TimeOffRequests', subname: 'Reject' },
  { name: 'UserDefinedFieldDefinitions' },
  { name: 'UserDefinedFieldListItems', childOf: 'UserDefinedFields', subname: 'ListItems' },//note, no parent native
                                                                                            // entity
  { name: 'WebhookEventErrorLogs' },
  { name: 'WorkTypeModifiers' },
  { name: 'ZoneInformation' },
]

/** The entities and their methods for interacting with the Autotask REST API. */
type Entities = {
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
     * client.Companies.query<{ id: number, name: string }>(...)
     *
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Basic_Query_Calls.htm
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Advanced_Query_Features.htm
     */
    query: T["name"] extends ModulesEntity
      ? <R extends Entity = Entity>() => Promise<QueryResponse<R>>
      : <R extends Entity = Entity>(
        query: QueryInput<R>
      ) => Promise<QueryResponse<R>>
    /**
     * Count available entities.
     *
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Advanced_Query_Features.htm
     */
    count: (query: CountInput) => Promise<CountResponse>
    /**
     * Get a specific entity.
     *
     * @example - The return type can be specified by:
     * client.Companies.query<{ id: number, name: string }>(...)
     *
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Basic_Query_Calls.htm
     */
    get: T["name"] extends ModulesEntity
      ? <R extends Entity = Entity>() => Promise<GetResponse<R>>
      : T["name"] extends AttachmentEntity
        ? <R extends Entity = Entity>(
          parentId: number,
          id: number
        ) => Promise<GetResponse<R>>
        : <R extends Entity = Entity>(id: number) => Promise<GetResponse<R>>
    /**
     * Update a specific entity. Fields omitted from the payload will **not**
     * be cleared in Autotask.
     *
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Updating_Data_PATCH.htm
     */
    update: T extends { childOf: string }
      ? (
        parentId: number,
        toSave: Entity,
        opts?: RequestOptions
      ) => Promise<UpdateResponse>
      : (
        toSave: Entity,
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
        toSave: Entity,
        opts?: RequestOptions
      ) => Promise<CreateResponse>
      : (
        toSave: Entity,
        opts?: RequestOptions
      ) => Promise<CreateResponse>
    /**
     * Delete a specific entity.
     *
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Delete_Operation.htm
     */
    delete: T extends { childOf: string }
      ? (
        parentId: number,
        id: number
      ) => Promise<DeleteResponse>
      : (id: number) => Promise<DeleteResponse>
    /**
     * Replace an entity. Fields omitted from the payload **will** be cleared
     * in Autotask.
     *
     * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Updating_Data_PUT.htm
     */
    replace: T extends { childOf: string }
      ? (
        parentId: number,
        toSave: Entity,
        opts?: RequestOptions
      ) => Promise<ReplaceResponse>
      : (
        toSave: Entity,
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

  readonly zoneInfo: null | GetResponse<{
    zoneName: string,
    url: string,
    webUrl: string,
    ci: number
  }>
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

  /** lookup/query an entity */
  _get(): Promise<JsonObject>
  /** delete an entity */
  _delete(): Promise<JsonObject>
  /** sparse update an entity */
  _patch(): Promise<JsonObject>
  /** full update an entity */
  _put(): Promise<JsonObject>
  /** create an entity */
  _post(): Promise<JsonObject>

  /**
   * Handles HTTP API calls.
   * @param method GET, POST, PUT, PATCH or DELETE
   * @param endpoint beginning with a / appended to the base url
   * @param query hash of query parameters, if applicable
   * @param payload to be converted to JSON, if provided
   * @param opts additional options (typically omitted)
   * @param opts.omit_credentials omits the credentials on the request.
   * @param opts.ImpersonationResourceId specifies an Autotask Resource ID to impersonate on a create/update operation
   */
  _fetch(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    endpoint: string,
    query?: JsonObject,
    payload?: JsonObject,
    opts?: RequestOptions
  ): Promise<JsonObject>
}

interface AutotaskRestApi extends Entities {
}

export {AutotaskRestApi}

/**
 * Extends errors, allow you to parse HTTP status and get details about REST API errors.
 */
export class AutotaskApiError extends Error {
  readonly status: number
  readonly details: JsonObject | string

  constructor(
    message: string,
    status: number,
    details: JsonObject | string
  )
}

export interface FilterOperators {
  /** Requires that the field value match the exact criteria provided */
  eq: "eq",
  /** Requires that the field value be anything other than the criteria provided */
  noteq: "noteq",
  /** Requires that the field value be greater than the criteria provided */
  gt: "gt",
  /** Requires that the field value be greater than or equal to the criteria provided */
  gte: "gte",
  /** Requires that the field value be less than the criteria provided */
  lt: "lt",
  /** Requires that the field value be less than or equal to the criteria provided */
  lte: "lte",
  /**  Requires that the field value begin with the defined criteria */
  beginsWith: "beginsWith",
  /** Requires that the field value end with the defined criteria */
  endsWith: "endsWith",
  /** Allows for the string provided as criteria to match any resource that contains the string in its value */
  contains: "contains",
  /**  Enter exist to query for fields in which the data you specify is not null. */
  exist: "exist",
  /** Enter notExist to query for fields in which the specified data is null */
  notExist: "notExist",
  /** With this value specified, the query will return only the values in the list array that match the field value you specify */
  in: "in",
  /** With this value specified, the query will only return the values in the list array that do not match the field value you specify */
  notIn: "notIn"
}
