import { Entity } from "./entities"

/** New values to update an entity with. */
export type EditInput<T extends Entity> =
  // Make the ID field required, if it exists on the entity.
  (T extends { id?: any } ? Required<Pick<T, "id">> : {}) & {
    // Make all fields nullable.
    [K in keyof Omit<T, "id">]?: T[K] | null
  }
/** Values to create a new entity with. */
export type CreateInput<T extends Entity> = {
  // Exclude the ID field, and make all other fields nullable.
  [K in keyof Omit<T, "id">]?: T[K] | null
}

/** Response from any mutation operation (create, replace, update, or delete). */
export type MutateResponse = { itemId: number }
