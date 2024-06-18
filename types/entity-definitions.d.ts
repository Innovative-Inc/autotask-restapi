import type * as entities from "../vendor/openapi-entity-types"

// Manually-defined here since it's missing from the OpenAPI spec.
type TimeOffRequestApprove = {
  id?: number
  timeOffRequestID?: number
}

/**
 * An array of available entity definitions.
 *
 * At minimum, each entity must have the `name` and `type` properties.
 *
 * If the entity is a child of another entity, it must have `childOf` and
 * `subname` properties.
 */
export type AvailableEntities = [
  {
    name: "zoneInformation"
    type: entities.ZoneInformationResult
    special: true
  },
  { name: "ActionTypes"; type: entities.ActionType },
  {
    name: "AdditionalInvoiceFieldValues"
    type: entities.AdditionalInvoiceFieldValue
  },
  { name: "Appointments"; type: entities.Appointment },
  { name: "AttachmentInfo"; type: entities.AttachmentInfo },
  { name: "ProjectCharges"; type: entities.ProjectCharge },
  { name: "BillingCodes"; type: entities.BillingCode },
  { name: "BillingItems"; type: entities.BillingItem },
  {
    name: "BillingItemApprovalLevels"
    type: entities.BillingItemApprovalLevel
  },
  { name: "ChangeOrderCharges"; type: entities.ChangeOrderCharge },
  { name: "ChangeRequestLinks"; type: entities.ChangeRequestLink },
  { name: "ChecklistLibraries"; type: entities.ChecklistLibrary },
  {
    name: "ChecklistLibraryChecklistItems"
    childOf: "ChecklistLibraries"
    subname: "ChecklistItems"
    type: entities.ChecklistLibraryChecklistItem
  },
  { name: "ClassificationIcons"; type: entities.ClassificationIcon },
  { name: "ClientPortalUsers"; type: entities.ClientPortalUser },
  { name: "ComanagedAssociations"; type: entities.ComanagedAssociation },
  { name: "Companies"; type: entities.Company },
  {
    name: "CompanyAlerts"
    childOf: "Companies"
    subname: "Alerts"
    type: entities.CompanyAlert
  },
  {
    name: "CompanyAttachments"
    childOf: "Companies"
    subname: "Attachments"
    type: entities.CompanyAttachment
  },
  {
    name: "CompanyContacts"
    childOf: "Companies"
    subname: "Contacts"
    type: entities.Contact
  },
  {
    name: "CompanyLocations"
    childOf: "Companies"
    subname: "Locations"
    type: entities.CompanyLocation
  },
  {
    name: "CompanyNotes"
    childOf: "Companies"
    subname: "Notes"
    type: entities.CompanyNote
  },
  {
    name: "CompanySiteConfigurations"
    childOf: "Companies"
    subname: "SiteConfigurations"
    type: entities.CompanySiteConfiguration
  },
  {
    name: "CompanyTeams"
    childOf: "Companies"
    subname: "Teams"
    type: entities.CompanyTeam
  },
  {
    name: "CompanyToDos"
    childOf: "Companies"
    subname: "ToDos"
    type: entities.CompanyToDo
  },
  { name: "CompanyWebhooks"; type: entities.CompanyWebhook },
  {
    name: "CompanyWebhookExcludedResources"
    childOf: "CompanyWebhooks"
    subname: "ExcludedResources"
    type: entities.CompanyWebhookExcludedResource
  },
  {
    name: "CompanyWebhookFields"
    childOf: "CompanyWebhooks"
    subname: "Fields"
    type: entities.CompanyWebhookField
  },
  {
    name: "CompanyWebhookUdfFields"
    childOf: "CompanyWebhoosk"
    subname: "UdfFields"
    type: entities.CompanyWebhookUdfField
  },
  { name: "ConfigurationItems"; type: entities.ConfigurationItem },
  {
    name: "ConfigurationItemAttachments"
    childOf: "ConfigurationItems"
    subname: "Attachments"
    type: entities.ConfigurationItemAttachment
  },
  {
    name: "ConfigurationItemBillingProductAssociations"
    childOf: "ConfigurationItems"
    subname: "BillingProductAssociations"
    type: entities.ConfigurationItemBillingProductAssociation
  },
  {
    name: "ConfigurationItemCategories"
    type: entities.ConfigurationItemCategory
  },
  {
    name: "ConfigurationItemCategoryUdfAssociations"
    childOf: "ConfigurationItemCategories"
    subname: "UdfAssociations"
    type: entities.ConfigurationItemCategoryUdfAssociation
  },
  {
    name: "ConfigurationItemNotes"
    childOf: "ConfigurationItems"
    subname: "Notes"
    type: entities.ConfigurationItemNote
  },
  {
    name: "ConfigurationItemNoteAttachments"
    childOf: "ConfigurationItemNotes"
    subname: "Attachments"
    type: entities.ConfigurationItemNoteAttachment
  },
  { name: "ConfigurationItemTypes"; type: entities.ConfigurationItemType },
  { name: "Contacts"; type: entities.Contact },
  {
    name: "ContactBillingProductAssociations"
    childOf: "Contacts"
    subname: "BillingProductAssociationis"
    type: entities.ContactBillingProductAssociation
  },
  { name: "ContactGroups"; type: entities.ContactGroup },
  {
    name: "ContactGroupContacts"
    childOf: "ContactGroups"
    subname: "Contacts"
    type: entities.ContactGroupContact
  },
  { name: "ContactWebhooks"; type: entities.ContactWebhook },
  {
    name: "ContactWebhookExcludedResources"
    childOf: "ContactWebhooks"
    subname: "ExcludedResources"
    type: entities.ContactWebhookExcludedResource
  },
  {
    name: "ContactWebhookFields"
    childOf: "ContactWebhooks"
    subname: "Fields"
    type: entities.ContactWebhookField
  },
  {
    name: "ContactWebhookUdfFields"
    childOf: "ContactWebhooks"
    subname: "UdfFields"
    type: entities.ContactWebhookUdfField
  },
  { name: "Contracts"; type: entities.Contract },
  {
    name: "ContractBillingRules"
    childOf: "Contracts"
    subname: "BillingRules"
    type: entities.ContractBillingRule
  },
  {
    name: "ContractBlocks"
    childOf: "Contracts"
    subname: "Blocks"
    type: entities.ContractBlock
  },
  {
    name: "ContractBlockHourFactors"
    childOf: "Contracts"
    subname: "BlockHourFactors"
    type: entities.ContractBlockHourFactor
  },
  {
    name: "ContractCharges"
    childOf: "Contracts"
    subname: "Charges"
    type: entities.ContractCharge
  },
  {
    name: "ContractExclusionBillingCodes"
    childOf: "Contracts"
    subname: "ExclusionBillingCodes"
    type: entities.ContractExclusionBillingCode
  },
  {
    name: "ContractExclusionRoles"
    childOf: "Contracts"
    subname: "ExclusionRoles"
    type: entities.ContractExclusionRole
  },
  { name: "ContractExclusionSets"; type: entities.ContractExclusionSet },
  {
    name: "ContractExclusionSetExcludedRoles"
    childOf: "ContractExclusionSets"
    subname: "ExcludedRoles"
    type: entities.ContractExclusionSetExcludedRole
  },
  {
    name: "ContractExclusionSetExcludedWorkTypes"
    childOf: "ContractExclusionSets"
    subname: "ExcludedWorkTypes"
    type: entities.ContractExclusionSetExcludedWorkType
  },
  {
    name: "ContractMilestones"
    childOf: "Contracts"
    subname: "Milestones"
    type: entities.ContractMilestone
  },
  {
    name: "ContractNotes"
    childOf: "Contracts"
    subname: "Notes"
    type: entities.ContractNote
  },
  {
    name: "ContractRates"
    childOf: "Contracts"
    subname: "Rates"
    type: entities.ContractRate
  },
  {
    name: "ContractRetainers"
    childOf: "Contracts"
    subname: "Retainers"
    type: entities.ContractRetainer
  },
  {
    name: "ContractRoleCosts"
    childOf: "Contracts"
    subname: "RoleCosts"
    type: entities.ContractRoleCost
  },
  {
    name: "ContractServices"
    childOf: "Contracts"
    subname: "Services"
    type: entities.ContractService
  },
  {
    name: "ContractServiceAdjustments"
    childOf: "Contracts"
    subname: "ServiceAdjustments"
    type: entities.ContractServiceAdjustment
  },
  {
    name: "ContractServiceBundles"
    childOf: "Contracts"
    subname: "ServiceBundles"
    type: entities.ContractServiceBundle
  },
  {
    name: "ContractServiceBundleAdjustments"
    childOf: "Contracts"
    subname: "ServiceBundleAdjustments"
    type: entities.ContractServiceBundleAdjustment
  },
  {
    name: "ContractServiceBundleUnits"
    childOf: "Contracts"
    subname: "ServiceBundleUnits"
    type: entities.ContractServiceBundleUnit
  },
  {
    name: "ContractServiceUnits"
    childOf: "Contracts"
    subname: "ServiceUnits"
    type: entities.ContractServiceUnit
  },
  {
    name: "ContractTicketPurchases"
    childOf: "Contracts"
    subname: "TicketPurchases"
    type: entities.ContractTicketPurchase
  },
  { name: "Countries"; type: entities.Country },
  { name: "Currencies"; type: entities.Currency },
  { name: "Departments"; type: entities.Department },
  // { name: "Expenses"; type: entities.Expense },
  {
    name: "ExpenseItems"
    childOf: "Expenses"
    subname: "Items"
    type: entities.ExpenseItem
  },
  { name: "ExpenseReports"; type: entities.ExpenseReport },
  {
    name: "Holidays"
    childOf: "HolidaySets"
    subname: "Holidays"
    type: entities.Holiday
  },
  { name: "HolidaySets"; type: entities.HolidaySet },
  { name: "InternalLocations"; type: entities.InternalLocation },
  {
    name: "InternalLocationWithBusinessHours"
    type: entities.InternalLocationWithBusinessHours
  },
  { name: "InventoryItems"; type: entities.InventoryItem },
  {
    name: "InventoryItemSerialNumbers"
    childOf: "InventoryItems"
    subname: "SerialNumbers"
    type: entities.InventoryItemSerialNumber
  },
  { name: "InventoryLocations"; type: entities.InventoryLocation },
  { name: "InventoryTransfers"; type: entities.InventoryTransfer },
  { name: "Invoices"; type: entities.Invoice },
  { name: "InvoiceTemplates"; type: entities.InvoiceTemplate },
  { name: "Modules"; type: entities.ModuleAccessResult; special: true },
  { name: "NotificationHistory"; type: entities.NotificationHistory },
  { name: "Opportunities"; type: entities.Opportunity },
  {
    name: "OpportunityAttachments"
    childOf: "Opportunities"
    subname: "Attachments"
    type: entities.OpportunityAttachment
  },
  { name: "OrganizationalLevel1s"; type: entities.OrganizationalLevel1 },
  { name: "OrganizationalLevel2s"; type: entities.OrganizationalLevel2 },
  {
    name: "OrganizationalLevelAssociations"
    type: entities.OrganizationalLevelAssociation
  },
  {
    name: "OrganizationalResources"
    childOf: "OrganizationalLevelAssociations"
    subname: "Resources"
    type: entities.OrganizationalResource
  },
  { name: "PaymentTerms"; type: entities.PaymentTerm },
  {
    name: "Phases"
    childOf: "Projects"
    subname: "Phases"
    type: entities.Phase
  },
  { name: "PriceListMaterialCodes"; type: entities.PriceListMaterialCode },
  { name: "PriceListProducts"; type: entities.PriceListProduct },
  { name: "PriceListProductTiers"; type: entities.PriceListProductTier },
  { name: "PriceListRoles"; type: entities.PriceListRole },
  { name: "PriceListServices"; type: entities.PriceListService },
  { name: "PriceListServiceBundles"; type: entities.PriceListServiceBundle },
  {
    name: "PriceListWorkTypeModifiers"
    type: entities.PriceListWorkTypeModifier
  },
  { name: "Products"; type: entities.Product },
  {
    name: "ProductNotes"
    childOf: "Products"
    subname: "Notes"
    type: entities.ProductNote
  },
  {
    name: "ProductTiers"
    childOf: "Products"
    subname: "Tiers"
    type: entities.ProductTier
  },
  {
    name: "ProductVendors"
    childOf: "Products"
    subname: "Vendors"
    type: entities.ProductVendor
  },
  { name: "Projects"; type: entities.Project },
  {
    name: "ProjectAttachments"
    childOf: "Projects"
    subname: "Attachments"
    type: entities.ProjectAttachment
  },
  {
    name: "ProjectCharges"
    childOf: "Projects"
    subname: "Charges"
    type: entities.ProjectCharge
  },
  {
    name: "ProjectNotes"
    childOf: "Projects"
    subname: "Notes"
    type: entities.ProjectNote
  },
  { name: "PurchaseApprovals"; type: entities.PurchaseApproval },
  { name: "PurchaseOrders"; type: entities.PurchaseOrder },
  {
    name: "PurchaseOrderItems"
    childOf: "PurchaseOrders"
    subname: "Items"
    type: entities.PurchaseOrderItem
  },
  {
    name: "PurchaseOrderItemReceiving"
    childOf: "PurchaseOrderItems"
    subname: "Receiving"
    type: entities.PurchaseOrderItemReceiving
  },
  { name: "Quotes"; type: entities.Quote },
  {
    name: "QuoteItems"
    childOf: "Quotes"
    subname: "Items"
    type: entities.QuoteItem
  },
  { name: "QuoteLocations"; type: entities.QuoteLocation },
  { name: "QuoteTemplates"; type: entities.QuoteTemplate },
  { name: "Resources"; type: entities.Resource },
  { name: "ResourceRoles"; type: entities.ResourceRole },
  {
    name: "ResourceRoleDepartments"
    childOf: "Resources"
    subname: "RoleDepartments"
    type: entities.ResourceRoleDepartment
  },
  {
    name: "ResourceRoleQueues"
    childOf: "Resources"
    subname: "RoleQueues"
    type: entities.ResourceRoleQueue
  },
  {
    name: "ResourceServiceDeskRoles"
    childOf: "Resources"
    subname: "ServiceDeskRoles"
    type: entities.ResourceServiceDeskRole
  },
  {
    name: "ResourceSkills"
    childOf: "Resources"
    subname: "Skills"
    type: entities.ResourceSkill
  },
  { name: "Roles"; type: entities.Role },
  {
    name: "SalesOrders"
    childOf: "Opportunities"
    subname: "SalesOrders"
    type: entities.SalesOrder
  },
  { name: "Services"; type: entities.Service },
  { name: "ServiceBundles"; type: entities.ServiceBundle },
  {
    name: "ServiceBundleServices"
    childOf: "ServiceBundles"
    subname: "Services"
    type: entities.ServiceBundleService
  },
  { name: "ServiceCalls"; type: entities.ServiceCall },
  {
    name: "ServiceCallTasks"
    childOf: "ServiceCalls"
    subname: "Tasks"
    type: entities.ServiceCallTask
  },
  {
    name: "ServiceCallTaskResources"
    childOf: "ServiceCallTasks"
    subname: "Resources"
    type: entities.ServiceCallTaskResource
  },
  {
    name: "ServiceCallTickets"
    childOf: "ServiceCalls"
    subname: "Tickets"
    type: entities.ServiceCallTicket
  },
  {
    name: "ServiceCallTicketResources"
    childOf: "ServiceCallTickets"
    subname: "Resources"
    type: entities.ServiceCallTicketResource
  },
  {
    name: "ServiceLevelAgreementResults"
    childOf: "ServiceLevelAgreements"
    subname: "Results"
    type: entities.ServiceLevelAgreementResults
  },
  { name: "ShippingTypes"; type: entities.ShippingType },
  { name: "Skills"; type: entities.Skill },
  { name: "Subscriptions"; type: entities.Subscription },
  {
    name: "SubscriptionPeriods"
    childOf: "Subscriptions"
    subname: "Periods"
    type: entities.SubscriptionPeriod
  },
  { name: "Surveys"; type: entities.Survey },
  { name: "SurveyResults"; type: entities.SurveyResults },
  { name: "Tasks"; childOf: "Projects"; subname: "Tasks"; type: entities.Task },
  {
    name: "TaskAttachments"
    childOf: "Tasks"
    subname: "Attachments"
    type: entities.TaskAttachment
  },
  {
    name: "TaskNotes"
    childOf: "Tasks"
    subname: "Notes"
    type: entities.TaskNote
  },
  {
    name: "TaskNoteAttachments"
    childOf: "TaskNotes"
    subname: "Attachments"
    type: entities.TaskNoteAttachment
  },
  {
    name: "TaskPredecessors"
    childOf: "Tasks"
    subname: "Predecessors"
    type: entities.TaskPredecessor
  },
  {
    name: "TaskSecondaryResources"
    childOf: "Tasks"
    subname: "SecondaryResources"
    type: entities.TaskSecondaryResource
  },
  { name: "Taxes"; type: entities.Tax },
  { name: "TaxCategories"; type: entities.TaxCategory },
  { name: "TaxRegions"; type: entities.TaxRegion },
  {
    name: "ThresholdInformation"
    type: entities.ThresholdStatusResult
    special: true
  },
  { name: "Tickets"; type: entities.Ticket },
  {
    name: "TicketAdditionalConfigurationItems"
    childOf: "Tickets"
    subname: "AdditionalConfigurationItems"
    type: entities.TicketAdditionalConfigurationItem
  },
  {
    name: "TicketAdditionalContacts"
    childOf: "Tickets"
    subname: "AdditionalContacts"
    type: entities.TicketAdditionalContact
  },
  {
    name: "TicketAttachments"
    childOf: "Tickets"
    subname: "Attachments"
    type: entities.TicketAttachment
  },
  { name: "TicketCategories"; type: entities.TicketCategory },
  {
    name: "TicketCategoryFieldDefaults"
    childOf: "TicketCategories"
    subname: "FieldDefaults"
    type: entities.TicketCategoryFieldDefaults
  },
  {
    name: "TicketChangeRequestApprovals"
    childOf: "Tickets"
    subname: "ChangeRequestApprovals"
    type: entities.TicketChangeRequestApproval
  },
  {
    name: "TicketCharges"
    childOf: "Tickets"
    subname: "Charges"
    type: entities.TicketCharge
  },
  {
    name: "TicketChecklistItems"
    childOf: "Tickets"
    subname: "ChecklistItems"
    type: entities.TicketChecklistItem
  },
  {
    name: "TicketChecklistLibraries"
    childOf: "Tickets"
    subname: "ChecklistLibraries"
    type: entities.TicketChecklistLibrary
  },
  { name: "TicketHistory"; type: entities.TicketHistory },
  {
    name: "TicketNotes"
    childOf: "Tickets"
    subname: "Notes"
    type: entities.TicketNote
  },
  {
    name: "TicketNoteAttachments"
    childOf: "TicketNotes"
    subname: "Attachments"
    type: entities.TicketNoteAttachment
  },
  {
    name: "TicketRmaCredits"
    childOf: "Tickets"
    subname: "RmaCredits"
    type: entities.TicketRmaCredit
  },
  {
    name: "TicketSecondaryResources"
    childOf: "Tickets"
    subname: "SecondaryResources"
    type: entities.TicketSecondaryResource
  },
  { name: "TimeEntries"; type: entities.TimeEntry },
  {
    name: "TimeEntryAttachments"
    childOf: "TimeEntries"
    subname: "Attachments"
    type: entities.TimeEntryAttachment
  },
  {
    name: "TimeOffRequestsApprove"
    childOf: "TimeOffRequests"
    subname: "Approve"
    type: TimeOffRequestApprove
  },
  { name: "TimeOffRequests"; type: entities.TimeOffRequest },
  {
    name: "TimeOffRequestsReject"
    childOf: "TimeOffRequests"
    subname: "Reject"
    type: entities.TimeOffRequestReject
  },
  {
    name: "UserDefinedFieldDefinitions"
    type: entities.UserDefinedFieldDefinition
  },
  {
    name: "UserDefinedFieldListItems"
    childOf: "UserDefinedFields"
    subname: "ListItems"
    type: entities.UserDefinedFieldListItem
  }, // note, no parent native entity
  { name: "WebhookEventErrorLogs"; type: entities.WebhookEventErrorLog },
  { name: "WorkTypeModifiers"; type: entities.WorkTypeModifier },
  {
    name: "ZoneInformation"
    type: entities.ZoneInformationResult
    special: true
  }
]

// Special entities
/**
 * Type guard to determine if an entity is a special entity that doesn't follow
 * the normal query response structure.
 */
export type IsSpecialEntity<T extends { name: string }> = T extends {
  special: true
}
  ? true
  : false

/** Attachment entities, which require a special query structure. */
export type AttachmentEntity =
  | "ConfigurationItemAttachments"
  | "ConfigurationItemNoteAttachments"
  | "OpportunityAttachments"
  | "TaskAttachments"
  | "TaskNoteAttachments"
  | "TicketAttachments"
  | "TicketNoteAttachments"
  | "TimeEntryAttachments"
