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
