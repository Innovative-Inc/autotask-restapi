import type * as entities from "../vendor/openapi-entity-types"

// The goal is to remove this test once the spec is updated by Autotask support.
test("time-off request approvals still missing from spec", () => {
  // Control test
  expectTypeOf<entities.TimeOffRequestReject>().toMatchTypeOf<{ id?: number }>()
  // Actual target
  // @ts-expect-error - TimeOffRequestApprove is not in the spec.
  expectTypeOf<entities.TimeOffRequestApprove>().toMatchTypeOf<{
    id?: number
  }>()
})
