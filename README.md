# Autotask REST API NodeJS Connector

# v2 Release Notes

## Breaking changes:
1. Codebase now uses native fetch and requires Node > 18.0.0. (Removed dependency on `isomorphic-fetch`.)
1. Removed the api() method. All API entity references are now available directly on the AutotaskRestApi instance.
1. API calls automatically invoke the `zoneInformation` API when needed. No initialization is necessary.


This connector simplifies interaction with the [Autotask PSA REST API](https://ww3.autotask.net/help/DeveloperHelp/Content/AdminSetup/2ExtensionsIntegrations/APIs/REST/REST_API_Home.htm) for developers using NodeJS.

> Please insure you are using a LTS version of NodeJS, or at least a version that supports ES6 promises.

```bash
npm install @apigrate/autotask-restapi --save
```
## Connecting to Autotask

```javascript
const {AutotaskRestApi} = require('@apigrate/autotask-restapi');

const autotask = new AutotaskRestApi(
  process.env.AUTOTASK_USER, // make sure it's an API User
  process.env.AUTOTASK_SECRET, 
  process.env.AUTOTASK_INTEGRATION_CODE 
);
```

> The Autotask REST API has endpoints ("zones") distributed around the world. The connector **automatically determines the correct endpoint when you make your first API call**. There is no need to get the zone information separately.

```javascript

let company = await autotask.Companies.get(0);//Get the root company

```

## Methods Available on Each Entity
The following sections list the methods on each available entity on the connector. 

> Not all methods may be applicable for an entity. For example, most entities do not support **delete**; therefore, expect an error if you attempt to use a method in an inappropriate context.

### count

Counts entities. Use Autotask **query filter syntax** to provide criteria for the count.

```javascript
// Count companies with a CompanyName beginning with "B"
result = await autotask.Companies.count({
  filter:[
    {
        "op": "beginsWith",
        "field": "CompanyName",
        "value": "B"
    }
  ]
});
// result = {queryCount: 7}

// Count all the contacts in Autotask
result = await autotask.Contacts.count({
  filter:[
    {
        "op": "gte",
        "field": "Id",
        "value": 0
    }
  ]
});
// result = {queryCount: 1209}
```
[related Autotask documentation](https://ww3.autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Basic_Query_Calls.htm)

### get
Get a single entity by id.
```javascript
let product = await autotask.Products.get(232486923);
// product = { item: { id: 232486923, ...product object properties... } }
```

> When you attempt to get an an entity by id that **doesn't exist**, this connector automatically swallows the HTTP-404 returned by the Autotask REST API and instead returns `{item: null}`. This is an intentional decision to facilitate better code readability.

> Note, filter expressions using the `get` method are not supported. Use the `query` method instead.

[related Autotask documentation](https://ww3.autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Basic_Query_Calls.htm)

> Special case: To retrieve attachment base64-encoded data, you must use an attachment-specific parent-child GET request. For: 'ConfigurationItemAttachments', 'ConfigurationItemNoteAttachments', 'OpportunityAttachments', 'TaskAttachments', 'TaskNoteAttachments', 'TicketAttachments', 'TicketNoteAttachments', 'TimeEntryAttachments', you must use the following `get` syntax:

Get a entity attachment data by id
```javascript
// TicketID 129873
// AttachmentID 232486923
let ticketAttachment = await autotask.TicketAttachments.get(129873, 232486923);

// ticketAttachment = { items: { id: 232486923, ..., data: "iVBORw0KGgoAAAANSUhEUgAAAV8AAAC (...the rest of the base64 ecoded data)..." } }
```


### query
Query for entities matching a filter expression.
```javascript
//Find a company by name
let result = await autotask.Companies.query({
  filter:[
    {
        "op": "eq",
        "field": "CompanyName",
        "value": "Sirius Cybernetics Corporation "
    }
  ]
});
```

Query results take the following form (example shows the Company returned from the above query)
```json
{
  "items": [
    {
      "id": 29683616,
      "additionalAddressInformation": "",
      "address1": null,
      "address2": null,
      "alternatePhone1": "",
      ...
      "surveyCompanyRating": null,
      "taxID": "",
      "taxRegionID": null,
      "territoryID": null,
      "webAddress": null,
      "userDefinedFields": []
    }
  ],
  "pageDetails": {
    "count": 1,
    "requestCount": 500,
    "prevPageUrl": null,
    "nextPageUrl": null
  }
}
```

#### Limiting fields returned on a query.

```javascript
//Find a company by name
let result = await autotask.Companies.query({
  filter:[
    {
        "op": "eq",
        "field": "CompanyName",
        "value": "Sirius Cybernetics Corporation "
    }
  ],
  includeFields:[
    "Id",
    "companyName",
    "city",
    "state"
  ]
});
```

Running the above query yields a response:
```json
{
  "items": [
    {
      "id": 29683616,
      "city": "",
      "companyName": "Sirius Cybernetics Corporation",
      "state": "",
      "userDefinedFields": []
    }
  ],
  "pageDetails": {
    "count": 1,
    "requestCount": 500,
    "prevPageUrl": null,
    "nextPageUrl": null
  }
}
```

> Note: when using creating filters and specifying field include conditions, field names are not case sensitive.

#### Querying User Defined Fields

It is possible to query user-defined fields by including a `"udf": true` to UDF field expressions in filter conditions. In the example below, a Company-level UDF named "Number of Employees" exists. We can query to see which companies have more than 0 employees like this:

```javascript
result = await autotask.Companies.query({
  filter:[
    {
        "op": "gt",
        "field": "Number of Employees",
        "value": 0,
        "udf": true
    }
  ]
});
```

[related Autotask documentation](https://ww3.autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Advanced_Query_Features.htm)

### queryAll

Query for entities matching a filter expression, returning all results. This method is useful when you need to retrieve
all entities that match a filter, not just the first 500.

> Note: this method returns an async iterator, so all results won't be loaded in memory at once.

```javascript
for await (const company of autotask.Companies.queryAll({
  filter:[
    {
      "op": "eq",
      "field": "CompanyName",
      "value": "Sirius Cybernetics Corporation "
    }
  ]
})){
  // Do something with the company.
}
```

This method can also be configured to yield pages instead by setting `yieldPages` to `true`.

```javascript
for await (const page of autotask.Companies.queryAll({
  filter:[
    {
      "op": "eq",
      "field": "CompanyName",
      "value": "Sirius Cybernetics Corporation "
    }
  ],
  yieldPages: true
})){
  // Do something with the page.
}
```

Otherwise, this method behaves the same as the `query` method above.

### create
Creates an entity.

The following creates **Company** using the **Companies** api.
```javascript
 let myCompany = {
      CompanyName: "Sirius Cybernetics Corporation",
      CompanyType: 3,
      Phone: '8005551212',
      OwnerResourceID: 29683995
    };;
result = await autotask.Companies.create(myCompany);
```
..which yields the `result`:
```json
{
  "itemId": 29683664
}
```

> Note some entities in the Autotask REST API are child entities of other entities. This does NOT affect how you **query or retrieve them**, but it does require you to provide the parent entity id when using the `create()`, `update()`, `replace()`, or `delete()` methods.

To illustrate the **child record** relationship, the following example will create a **ToDo** for a **Company** using the **CompanyToDos** api.
```javascript
 let myToDo = {
  ActionType: 3,
  AssignedToResourceID: 29683995,
  CompanyID: 0, 
  ActivityDescription: "Learn more about the Autotask REST API",
  StartDateTime: '2020-06-15',
  EndDateTime: '2020-06-16',
};
result = await autotask.CompanyToDos.create(0, myToDo);
```

Note the use of the parent id (company id = 0) as the first argument of the `create` method. The parent id is required as the first parameter of the method.
It yields the `result`:

```json
{
  "itemId": 29684378
}
```

[related Autotask documentation](https://ww3.autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Creating_Resources.htm)

### update
Updates an entity. This updates **ONLY the fields you specify**, leaving other fields on it unchanged.

The following example updates  a **Company** phone number.
```javascript

let updateResult = await autotask.Company.update({"id":45701237, phone: "1112223344"});

```

As mentioned in the create() documentation above, **child record relationships** require a slight change in syntax when invoking updates on sub-entities. 
Here is another example of the **child record relationship**, using the Contacts entity. Since Contacts are children of Companies, we must also provide the CompanyID of the
Contact before we can update it.

```javascript
// Here we are using the autotask.Contacts handle. Queries don't require knowledge of parent-child structure.
let queryResult = await autotask.Contacts.query({filter:[{field:'firstName', op:FilterOperators.eq, value:'Zaphod'}]});

let companyID = queryResult.items[0].companyID;

// However, here we are using the autotask.CompanyContacts handle because of the structure required by the Autotask REST API. The parent entity is provided as the first argument of the update.
let updateResult = await autotask.CompanyContacts.update(companyID, {"id":30684047, middleName: "Hortensius"});
```


> Note some entities in the Autotask REST API are child entities of other entities. This doesn't affect how you query or retrieve them, but it does require you to provide the parent entity id when using the `create()`, `update()`, `replace()`, or `delete()` methods.
                                 
[related Autotask documentation](https://ww3.autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Updating_Data_PATCH.htm)

### replace
Replaces an entity. This replaces **the entire entity**, obliterating its prior contents (except for readonly fields) and replacing it with the data you provide.

> Note some entities in the Autotask REST API are child entities of other entities. This doesn't affect how you query or retrieve them, but it does require you to provide the parent entity id when using the `create()`, `update()`, `replace()`, or `delete()` methods.

[related Autotask documentation](https://ww3.autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Updating_Data_PUT.htm)

### delete
Deletes an entity by id.

> Note some entities in the Autotask REST API are child entities of other entities. This doesn't affect how you query or retrieve them, but it does require you to provide the parent entity id when using the `create()`, `update()`, `replace()`, or `delete()` methods.

[related Autotask documentation](https://ww3.autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Delete_Operation.htm)

### info
[related Autotask documentation](https://ww3.autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_EntityInformationCall.htm)

### fieldInfo
Get metadata about a given entity's fields. This includes information about the data type; whether the field is required, read-only etc; and any valid-values that should be used.
[related Autotask documentation](https://ww3.autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_EntityInformationCall.htm)

```javascript
result = await autotask.AccountToDo.fieldInfo();
```

This will yield a `result`:

```json
{
  "fields": [
    {
      "name": "ActionType",
      "dataType": "integer",
      "length": 0,
      "isRequired": true,
      "isReadOnly": false,
      "isQueryable": true,
      "isReference": false,
      "referenceEntityType": "",
      "isPickList": true,
      "picklistValues": [
        {
          "value": "0",
          "label": "Opportunity Update",
          "isDefaultValue": false,
          "sortOrder": 0,
          "parentValue": "",
          "isActive": true,
          "isSystem": true
        },
        {
          "value": "1",
          "label": "Phone Call",
          "isDefaultValue": false,
          "sortOrder": 0,
          "parentValue": "",
          "isActive": true,
          "isSystem": true
        },
        ...
      ],
      "picklistParentValueField": "",
      "isSupportedWebhookField": false
    },
    {
      "name": "ActivityDescription",
      "dataType": "string",
      "length": 32000,
      "isRequired": false,
      "isReadOnly": false,
      "isQueryable": true,
      "isReference": false,
      "referenceEntityType": "",
      "isPickList": false,
      "picklistValues": null,
      "picklistParentValueField": "",
      "isSupportedWebhookField": false
    },
    ...
    
  ]
}
```
[related Autotask documentation](https://ww3.autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_EntityInformationCall.htm)

### udfInfo
[related Autotask documentation](https://ww3.autotask.net/help/DeveloperHelp/Content/APIs/REST/Entities/UserdefinedFieldsUDFs.htm)

### Special Cases

#### Modules
The Modules entity allows you to gather information about the active status of modules in Autotask PSA. It can only be queried. Use either empty `.get()` or `.query()` methods to obtain the list of modules.

Example:

```javascript
result = await autotask.Modules.get();
```

results:

```json
{
  "modules": [
    {
      "key": 24,
      "value": true
    },
    {
      "key": 36,
      "value": true
    },
    {
      "key": 65,
      "value": true
    },
    ...
}

```


[related Autotask documentation](https://ww3.autotask.net/help/DeveloperHelp/Content/APIs/REST/Entities/ModulesEntity.htm)

## Available Entities

The following is a list of all Autotask entities supported by the connector:
* ActionTypes
* AdditionalInvoiceFieldValues
* Appointments
* AttachmentInfo
* ProjectCharges
* BillingCodes
* BillingItems
* BillingItemApprovalLevels
* ChangeOrderCharges
* ChangeRequestLinks
* ChecklistLibraries
* ClassificationIcons
* ClientPortalUsers
* ComanagedAssociations
* Companies
* CompanyWebhooks
* ConfigurationItems
* ConfigurationItemCategories
* ConfigurationItemTypes
* Contacts
* ContactGroups
* ContactWebhooks
* Contracts
* ContractExclusionSets
* Countries
* Currencies
* Departments
* Expenses
* ExpenseReports
* HolidaySets
* InternalLocations
* InternalLocationWithBusinessHours
* InventoryItems
* InventoryLocations
* InventoryTransfers
* Invoices
* InvoiceTemplates
* Modules
* NotificationHistory
* Opportunities
* OrganizationalLevel1
* OrganizationalLevel2
* OrganizationalLevelAssociations
* PaymentTerms
* PriceListMaterialCodes
* PriceListProducts
* PriceListProductTiers
* PriceListRoles
* PriceListServices
* PriceListServiceBundles
* PriceListWorkTypeModifiers
* Products
* Projects
* PurchaseApprovals
* PurchaseOrders
* Quotes
* QuoteLocations
* QuoteTemplates
* Resources
* ResourceRoles
* Roles
* Services
* ServiceBundles
* ServiceCalls
* ShippingTypes
* Skills
* Subscriptions
* Surveys
* SurveyResults
* Taxes
* TaxCategories
* TaxRegions
* ThresholdInformation
* Tickets
* TicketCategories
* TicketHistory
* TimeEntries
* TimeOffRequests
* UserDefinedFieldDefinitions
* WebhookEventErrorLogs
* WorkTypeModifiers
* ZoneInformation

The REST API introduces a parent-child relationship among some Autotask entities. The connector uses a shorthand name to make working with the entities more intuitive. The following child-entities are also supported by the connector:

* ChecklistLibraryChecklistItems &rarr; ChecklistLibraries/ChecklistItems
* CompanyAlerts &rarr; Companies/Alerts
* CompanyAttachments &rarr; Companies/Attachments
* CompanyContacts &rarr; Companies/Contacts
* CompanyLocations &rarr; Companies/Locations
* CompanyNotes &rarr; Companies/Notes
* CompanySiteConfigurations &rarr; Companies/SiteConfigurations
* CompanyTeams &rarr; Companies/Teams
* CompanyToDos &rarr; Companies/ToDos
* CompanyWebhookExcludedResources &rarr; CompanyWebhooks/ExcludedResources
* CompanyWebhookFields &rarr; CompanyWebhooks/Fields
* CompanyWebhookUdfFields &rarr; CompanyWebhoosk/UdfFields
* ConfigurationItemAttachments &rarr; ConfigurationItem/Attachments
* ConfigurationItemBillingProductAssociations &rarr; ConfigurationItems/BillingProductAssociations
* ConfigurationItemCategoryUdfAssociations &rarr; ConfigurationItemCategories/UdfAssociations
* ConfigurationItemNotes &rarr; ConfigurationItems/Notes
* ConfigurationItemNoteAttachments &rarr; ConfigurationItemNotes/Attachments
* ContactBillingProductAssociations &rarr; Contacts/BillingProductAssociationis
* ContactGroupContacts &rarr; ContactGroups/Contacts
* ContactWebhookExcludedResources &rarr; ContactWebhooks/ExcludedResources
* ContactWebhookFields &rarr; ContactWebhooks/Fields
* ContactWebhookUdfFields &rarr; ContactWebhooks/UdfFields
* ContractBillingRules &rarr; Contracts/BillingRules
* ContractBlocks &rarr; Contracts/Blocks
* ContractBlockHourFactors &rarr; Contracts/BlockHourFactors
* ContractCharges &rarr; Contracts/Charges
* ContractExclusionBillingCodes &rarr; Contracts/ExclusionBillingCodes
* ContractExclusionRoles &rarr; Contracts/ExclusionRoles
* ContractExclusionSetExcludedRoles &rarr; ContractExclusionSets/ExcludedRoles
* ContractExclusionSetExcludedWorkTypes &rarr; ContractExclusionSets/ExcludedWorkTypes
* ContractMilestones &rarr; Contracts/Milestones
* ContractNotes &rarr; Contracts/Notes
* ContractRates &rarr; Contracts/Rates
* ContractRetainers &rarr; Contracts/Retainers
* ContractRoleCosts &rarr; Contracts/RoleCosts
* ContractServices &rarr; Contracts/Services
* ContractServiceAdjustments &rarr; Contracts/ServiceAdjustments
* ContractServiceBundles &rarr; Contracts/ServiceBundles
* ContractServiceBundleAdjustments &rarr; Contracts/ServiceBundleAdjustments
* ContractServiceBundleUnits &rarr; Contracts/ServiceBundleUnits
* ContractServiceUnits &rarr; Contracts/ServiceUnits
* ContractTicketPurchases &rarr; Contracts/TicketPurchases
* ExpenseItems &rarr; Expenses/Items
* Holidays &rarr; HolidaySets/Holidays
* InventoryItemSerialNumbers &rarr; InventoryItems/SerialNumbers
* OpportunityAttachments &rarr; Opportunities/Attachments
* OrganizatonalResources &rarr; OrganizationalLevelAssociations/Resources
* Phases &rarr; Projects/Phases
* ProductNotes &rarr; Products/Notes
* ProductTiers &rarr; Products/Tiers
* ProductVendors &rarr; Products/Vendors
* ProjectAttachments &rarr; Projects/Attachments
* ProjectCharges &rarr; Projects/Charges
* ProjectNotes &rarr; Projects/Notes
* PurchaseOrderItems &rarr; PurchaseOrders/Items
* PurchaseOrderItemReceiving &rarr; PurchaseOrderItems/Receiving
* QuoteItems &rarr; Quotes/Items
* ResourceRoleDepartments &rarr; Resources/RoleDepartments
* ResourceRoleQueues &rarr; Resources/RoleQueues
* ResourceServiceDeskRoles &rarr; Resources/ServiceDeskRoles
* ResourceSkills &rarr; Resources/Skills
* SalesOrders &rarr; Opportunities/SalesOrders
* ServiceBundleServices &rarr; ServiceBundles/Services
* ServiceCallTasks &rarr; ServiceCalls/Tasks
* ServiceCallTaskResource &rarr; ServiceCallTasks/Resources
* ServiceCallTickets &rarr; ServiceCalls/Tickets
* ServiceCallTicketResource &rarr; ServiceCallTickets/Resources
* ServiceLevelAgreementResults &rarr; ServiceLevelAgreements/Results
* SubscriptionPeriods &rarr; Subscriptions/Periods
* Tasks &rarr; Projects/Tasks
* TaskAttachments &rarr; Tasks/Attachments
* TaskNotes &rarr; Tasks/Notes
* TaskNoteAttachments &rarr; TaskNotes/Attachments
* TaskPredecessors &rarr; Tasks/Predecessors
* TaskSecondaryResources &rarr; Tasks/SecondaryResources
* TicketAdditionalConfigurationItems &rarr; Tickets/AdditionalConfigurationItems
* TicketAdditionalContacts &rarr; Tickets/AdditionalContacts
* TicketAttachments &rarr; Tickets/Attachments
* TicketCategoryFieldDefaults &rarr; TicketCategories/FieldDefaults
* TicketChangeRequestApprovals &rarr; Tickets/ChangeRequestApprovals
* TicketCharges &rarr; Tickets/Charges
* TicketChecklistItems &rarr; Tickets/ChecklistItems
* TicketChecklistLibraries &rarr; Tickets/ChecklistLibraries
* TicketNotes &rarr; Tickets/Notes
* TicketNoteAttachments &rarr; TicketNotes/Attachments
* TicketRmaCredits &rarr; Tickets/RmaCredits
* TicketSecondaryResources &rarr; Tickets/SecondaryResources
* TimeEntryAttachments &rarr; TimeEntries/Attachments
* TimeOffRequestsApprove &rarr; TimeOffRequests/Approve
* TimeOffRequestsReject &rarr; TimeOffRequests/Reject
* UserDefinedFieldListItems &rarr; UserDefinedFields/ListItems

## Error Handling

REST API HTTP errors are wrapped in an AutotaskApiError class that can be used to obtain further information about errors returned from Autotask.

For example:

```javascript
try{
  let myCompany = {
    CompanyName: undefined, //<-- it is required!
    CompanyType: 3,
    Phone: '8005551212',
    OwnerResourceID: 29683995
  };
  let result = await autotask.Companies.create(myCompany);

} catch ( err ){
  if( err instance of AutotaskApiError ){
    // Custom handling is possible for Autotask REST API errors.
    console.error(`Error message: ${ err.message }\nHTTP status: ${ err.status }\nError Details: ${ JSON.stringify(err.details) }`)
  }
}
```

Please note, in some cases, the Autotask REST API HTTP error handling may not behave in ways you might expect. For example:

An invalid API username will lead to an HTTP 500 error returning:
```json 
{"errors":["Zone information could not be determined"]}
```
, not an HTTP 401 error.

An invalid API Integration key will lead to an HTTP 500 error returning:
```json 
{"errors":["IntegrationCode is invalid."]}
```
, not an HTTP 401 error.

## Debugging

Support for debugging is provided via the [debug]() library. Two levels of debugging are supported:

* **debug** include `autotask:restapi` in your `DEBUG` environment variable
* **verbose** include `autotask:restapi:verbose` or simply `autotask:restapi*` in your `DEBUG` environment variable.

