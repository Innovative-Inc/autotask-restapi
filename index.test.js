require('dotenv').config();
let {AutotaskRestApi, FilterOperators, AutotaskApiError} = require('.');
var autotask = null;

beforeAll(async ()=>{
  autotask = new AutotaskRestApi(
    process.env.AUTOTASK_USER, 
    process.env.AUTOTASK_SECRET, 
    process.env.AUTOTASK_INTEGRATION_CODE );
  await autotask.Companies.info();
});

it('must load zoneInfo on automatically on an API call', async () => {
  await autotask.Companies.info();
  expect(autotask.zoneInfo).toBeDefined();
  // console.log('zoneInfo result: %o', autotask.zoneInfo);
  expect(autotask.zoneInfo.url).toBeDefined();
});

it('can get by id', async () => {
  let result = await autotask.Companies.get(0);
  // console.log('get result: %o', result);
  let company = result.item;
  expect(company).toBeDefined();
  expect(company.id).toBe(0);
});

describe('retries', () => {
  it('should retry on 429', async () => {
    // Mock fetch to return 429 once, then reset.
    const fetchMock = vi.spyOn(global, 'fetch').mockImplementationOnce(() => Promise.resolve({
      status: 429, ok: false, json: () => Promise.resolve({}),
    }));

    let result = await autotask.Companies.get(0);
    let company = result.item

    expect(company).toBeDefined();
    expect(company.id).toBe(0);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  })

  it('should not retry if disabled', async () => {
    // Mock fetch to return 429 once, then reset.
    const fetchMock = vi.spyOn(global, 'fetch').mockImplementationOnce(() => Promise.resolve({
      status: 429, ok: false, text: () => Promise.resolve('')
    }));
    vi.spyOn(autotask.retryOptions, 'enabled', 'get').mockReturnValue(false);

    await expect(autotask.Companies.get(0)).rejects.toThrow(AutotaskApiError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  })
})

test('can query multiple.', async () => {

  let result = await autotask.Companies.query({filter:[
    {
      field: "companyName",
      op: FilterOperators.beginsWith,
      value: "A"
    },
    {
      field: "id",
      op: FilterOperators.gt,
      value: 0
    }
  ]});
  // console.log('query result: %o', result);
  expect(result.items).toBeDefined();
  let item = result.items[0];
  expect(item.id).toBeGreaterThan(0);
  expect(item.companyName).toMatch(/A.*/);
});

describe('pagination with query all', () => {
  it('should iterate items by default', async () => {
    // Use a combination of `MaxRecords` here and `iterations` below to ensure we get more than one page while
    // drastically improving performance.
    const func = autotask.Companies.queryAll({
      filter: [{field: 'id', op: FilterOperators.gt, value: 0}], MaxRecords: 1
    });
    const items = [];

    let iterations = 0
    for await (const item of func) {
      items.push(item);
      iterations++
      if (iterations >= 2) break;
    }

    expect(items.length).toEqual(2);
    const item = items[1];
    expect(item.id).toBeGreaterThan(0);
  })

  it('should iterate pages if set', async () => {
    // Use a combination of `MaxRecords` here and `iterations` below to ensure we get more than one page while
    // drastically improving performance.
    const func = autotask.Companies.queryAll({
      filter: [{field: 'id', op: FilterOperators.gt, value: 0}], MaxRecords: 1
    }, true);
    const pages = [];

    let iterations = 0
    for await (const page of func) {
      pages.push(page);
      iterations++
      if (iterations >= 2) break;
    }

    expect(pages.length).toEqual(2);
    const page = pages[1];
    expect(page.items).toBeDefined();
    const item = page.items[0];
    expect(item.id).toBeGreaterThan(0);
  })
})

let contactIdCreated = null;
test('can create an entity', async () => {
  let contact = {
    companyID: 0,
    firstName: "Tester",
    middleInitial: "Xavier",
    lastName: "Testington",
    isActive: 0,
  };
  let result = await autotask.CompanyContacts.create(0, contact);
  // console.log('create result: %o', result);
  let itemId = result.itemId;
  expect(itemId).toBeDefined();
  expect(itemId).toBeGreaterThan(0); 
  contactIdCreated = itemId;
});

test('can update an entity', async () => {
  let contactUpdate = {
    id: contactIdCreated,
    firstName: "Ingrid",
    isActive: 0,
  };
  let result = await autotask.CompanyContacts.update(0, contactUpdate);
  // console.log('update result: %o', result);
  expect(result).toBeDefined();
  let {item: contactAfterUpdate} = await autotask.Contacts.get(contactIdCreated);
  expect(contactAfterUpdate).toBeDefined();
  expect(contactAfterUpdate.id).toBe(contactIdCreated);
  expect(contactAfterUpdate.firstName).toMatch(/Ingrid/);
  expect(contactAfterUpdate.middleInitial).toMatch(/Xavier/);
  expect(contactAfterUpdate.lastName).toMatch(/Testington/);
});

test('can replace an entity', async () => {
  let contactUpdate = {
    id: contactIdCreated,
    title: "Commander",
    firstName: "William",
    lastName: "Adama",
    isActive: 1,
  };
  let result = await autotask.CompanyContacts.replace(0, contactUpdate); 
  // console.log('update result: %o', result);
  expect(result).toBeDefined();
  let {item: contactAfterUpdate} = await autotask.Contacts.get(contactIdCreated);
  expect(contactAfterUpdate).toBeDefined();
  expect(contactAfterUpdate.id).toBe(contactIdCreated);
  expect(contactAfterUpdate.title).toMatch(/Commander/);
  expect(contactAfterUpdate.firstName).toMatch(/William/);
  expect(contactAfterUpdate.lastName).toMatch(/Adama/);
  expect(contactAfterUpdate.middleInitial).toBe(null);
  expect(contactAfterUpdate.isActive).toBe(1);
});


test('can delete an entity', async () => {
 
  let result = await autotask.CompanyContacts.delete(0, contactIdCreated);
  // console.log('delete result: %o', result);
  expect(result).toBeDefined();
  let {item: contactAfterUpdate} = await autotask.Companies.get(contactIdCreated);
  expect(contactAfterUpdate).toBeDefined();
});

test('item is null when when get by id not found', async () => {
  let result = await autotask.Companies.get(9999999);
  expect(result).toBeDefined();
  expect(result.item).toBe(null);
});

test('HTTP errors are handled', async () => {
  try{
    let myCompany = {
      CompanyName: undefined, //<-- it is required!
      CompanyType: 3,
      Phone: '8005551212',
      OwnerResourceID: 29683995
    };
    let result = await api.Companies.create(myCompany);
  }catch(err){
    if(err instanceof AutotaskRestApi){
      expect(err.status).toBe(500);
      expect(err.details).toBeDefined();
    }
  }
});

test('zoneinfo errors are handled', async () => {
  try{
    autotask = new AutotaskRestApi(
      "bad", 
      process.env.AUTOTASK_SECRET, 
      process.env.AUTOTASK_INTEGRATION_CODE );
    api = await autotask.api();
  }catch(err){
    if(err instanceof AutotaskRestApi){
      expect(err.status).toBe(500);
      expect(err.details).toBeDefined();
    }
  }
});

test('authorization errors are handled', async () => {
  try{
    autotask = new AutotaskRestApi(
      process.env.AUTOTASK_USER,
      process.env.AUTOTASK_SECRET+'bad', 
      process.env.AUTOTASK_INTEGRATION_CODE );
    api = await autotask.api();
  }catch(err){
    if(err instanceof AutotaskRestApi){
      expect(err.status).toBe(401);
      expect(err.details).toBeDefined();
    }
  }
});

test('integration code errors are handled', async () => {
  try{
    autotask = new AutotaskRestApi(
      process.env.AUTOTASK_USER,
      process.env.AUTOTASK_SECRET, 
      process.env.AUTOTASK_INTEGRATION_CODE+'bad' );
    api = await autotask.api();
  }catch(err){
    if(err instanceof AutotaskRestApi){
      expect(err.status).toBe(500);
      expect(err.details).toBeDefined();
    }
  }
});

