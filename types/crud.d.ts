import { Entity } from "./entities"

/** New values to update an entity with. */
export type EditInput<T extends Entity> = (T extends { id?: any }
  ? Required<Pick<T, "id">>
  : {}) & {
  [K in keyof Omit<T, "id">]?: T[K] | null
}
/** Values to create a new entity with. */
export type CreateInput<T extends Entity> = {
  [K in keyof Omit<T, "id">]?: T[K] | null
}

/** Response from any mutation operation (create, replace, update, or delete). */
export type MutateResponse = { itemId: number }
