import { JsonPrimitive, LiteralUnion, StringKeyOf, ValueOf } from "type-fest"

import { FilterOperators } from "../index"
import { Entity } from "./entities"

/** Type guard to determine if an entity has user-defined fields. */
export type HasUdf<T extends Entity> = T extends { userDefinedFields?: any[] }
  ? true
  : false
/** Type guard to determine if a field is a user-defined field. */
type IsUdf<T extends Entity, F extends string> =
  F extends StringKeyOf<T> ? false : true

/** Combine normal and user-defined fields (if applicable) into a flat union. */
export type AllFields<T extends Entity> =
  HasUdf<T> extends true ? LiteralUnion<StringKeyOf<T>, string> : StringKeyOf<T>

/** Operator to group filter expressions together. */
type GroupingOperator = "and" | "or"
/** Operator to compare two values for equality. */
type EqualityOperator = ValueOf<Pick<typeof FilterOperators, "eq" | "noteq">>
/** Operator to check for existence of a field value (i.e. null / not null). */
type ExistenceOperator = ValueOf<
  Pick<typeof FilterOperators, "exist" | "notExist">
>
/** Operator to check a field value for set membership. */
type SetOperator = ValueOf<Pick<typeof FilterOperators, "in" | "notIn">>
/** Operator to check a string field for a specific pattern */
type StringOperator = ValueOf<
  Pick<typeof FilterOperators, "beginsWith" | "endsWith" | "contains">
>
/** Operator to compare two values for order. */
type ComparisonOperator = ValueOf<
  Pick<typeof FilterOperators, "gt" | "gte" | "lt" | "lte">
>

/**
 * A filter expression to apply to a query.
 *
 * If a field is a user-defined field, the `udf` property needs to be set to
 * `true`.
 */
type FilterExpression<
  T extends Entity,
  F extends AllFields<T> = AllFields<T>
> = (
  | { op: GroupingOperator; items: FilterExpression<T>[] }
  | { op: EqualityOperator; field: F; value: JsonPrimitive }
  // Strings are allowed for string representations of dates.
  | { op: ComparisonOperator; field: F; value: Date | string | number }
  | { op: StringOperator; field: F; value: string }
  | { op: ExistenceOperator; field: F }
  | { op: SetOperator; field: F; value: JsonPrimitive[] }
) &
  (IsUdf<T, F> extends true ? { udf: true } : { udf?: false })

/**
 * A filter to apply to a query.
 *
 * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Basic_Query_Calls.htm
 */
export type FilterInput<T extends Entity> = {
  /** The filter expression to apply to the query. */
  filter: FilterExpression<T>[]
}
