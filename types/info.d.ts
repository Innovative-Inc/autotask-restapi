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

/** Field info properties shared among all field types. */
type SharedPicklistValues = {
  value: string
  label: string
  isDefaultValue: boolean
  sortOrder: number
  isActive: boolean
  isSystem: boolean
}
/** Field info properties exclusive to picklist fields. */
// `NullishValue` generic type exists because built-in fields and UDFs have
// different values when "null"
type PicklistFieldInfo<NullishValue> =
  // Normal picklist
  | {
      picklistParentValueField: NullishValue
      // However, it seems that both built-in fields and UDFs have the same
      // `parentValue` value when "null".
      picklistValues: ({ parentValue: "" } & SharedPicklistValues)[]
    }
  // Child picklist
  | {
      picklistParentValueField: string
      picklistValues: ({ parentValue: string } & SharedPicklistValues)[]
    }
/** Field info properties exclusive to non-picklist fields. */
type NonPicklistFieldInfo<NullishValue> = {
  picklistValues: null
  picklistParentValueField: NullishValue
}
/** Field info properties exclusive to reference fields. */
type ReferenceFieldInfo = { referenceEntityType: string }
/** Field info properties exclusive to non-reference fields. */
type NonReferenceFieldInfo<NullishValue> = {
  referenceEntityType: NullishValue
}
/** Field info properties exclusive to string fields. */
type StringFieldInfo = { maxLength: number }
/** Field info properties exclusive to non-string fields. */
type NonStringFieldInfo = { maxLength: 0 }

/** Info regarding an entity field. */
export type FieldInfo = {
  name: string
  isRequired: boolean
  isReadOnly: boolean
  isQueryable: boolean
  isSupportedWebhookField: boolean
} & (
  | // Normal, non-string field
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
  // Normal string field
  | ({
      dataType: "string"
      isPicklist: false
      isReference: false
    } & StringFieldInfo &
      NonPicklistFieldInfo<""> &
      NonReferenceFieldInfo<"">)
  // Picklist field
  | ({
      dataType: "integer"
      isPicklist: true
      isReference: false
    } & NonStringFieldInfo &
      PicklistFieldInfo<""> &
      NonReferenceFieldInfo<"">)
  // Reference field
  | ({
      dataType: "integer"
      isPicklist: false
      isReference: true
    } & NonStringFieldInfo &
      NonPicklistFieldInfo<""> &
      ReferenceFieldInfo)
)
/**
 * Info regarding the queried entity's fields.
 *
 * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_EntityInformationCall.htm
 */
export type FieldInfoResponse = { fields: FieldInfo[] }

/** User-defined field info properties exclusive to string fields. */
type StringUdfFieldInfo = { length: number }
/** User-defined field info properties exclusive to non-string fields. */
type NonStringUdfFieldInfo = { length: 0 }
/** Info regarding an entity user-defined field. */
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
  | // Normal, non-string field
  ({
      type: "double" | "datetime"
      isPicklist: false
      isReference: false
    } & NonStringUdfFieldInfo &
      NonPicklistFieldInfo<null> &
      NonReferenceFieldInfo<null>)
  // Normal string field
  | ({
      type: "string"
      isPicklist: false
      isReference: false
    } & StringUdfFieldInfo &
      NonPicklistFieldInfo<null> &
      NonReferenceFieldInfo<null>)
  // Picklist field
  | ({
      type: "integer"
      isPicklist: true
      isReference: false
    } & NonStringUdfFieldInfo &
      PicklistFieldInfo<null> &
      NonReferenceFieldInfo<null>)
  // Reference field
  | ({
      type: "integer"
      isPicklist: false
      isReference: true
    } & NonStringUdfFieldInfo &
      NonPicklistFieldInfo<null> &
      ReferenceFieldInfo)
)
/**
 * Info regarding the queried entity's user-defined fields.
 *
 * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_UserDefinedFieldInformationCall.htm
 */
export type UdfInfoResponse = { fields: UdfFieldInfo[] }
