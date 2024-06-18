import { JsonPrimitive, LiteralUnion, StringKeyOf, ValueOf } from "type-fest"

import { FilterOperators } from "../index"
import { Entity } from "./entities"

export type HasUdf<T extends Entity> = T extends { userDefinedFields?: any[] }
  ? true
  : false

/** Combine normal and user-defined fields (if applicable) into a flat union. */
export type AllFields<T extends Entity> =
  HasUdf<T> extends true ? LiteralUnion<StringKeyOf<T>, string> : StringKeyOf<T>

// filter expressions
type GroupingOperator = "and" | "or"
type EqualityOperator = ValueOf<Pick<typeof FilterOperators, "eq" | "noteq">>
type ExistenceOperator = ValueOf<
  Pick<typeof FilterOperators, "exist" | "notExist">
>
type SetOperator = ValueOf<Pick<typeof FilterOperators, "in" | "notIn">>
type StringOperator = ValueOf<
  Pick<typeof FilterOperators, "beginsWith" | "endsWith" | "contains">
>
type ComparisonOperator = ValueOf<
  Pick<typeof FilterOperators, "gt" | "gte" | "lt" | "lte">
>

type IsUdf<T extends Entity, F extends string> =
  F extends StringKeyOf<T> ? false : true

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

export type FilterInput<T extends Entity> = {
  /**
   * The filter expression to apply to the query.
   *
   * @link https://autotask.net/help/DeveloperHelp/Content/APIs/REST/API_Calls/REST_Basic_Query_Calls.htm
   */
  filter: FilterExpression<T>[]
}
