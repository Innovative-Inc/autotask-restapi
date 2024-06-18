import { Entity } from "./entities"

export type EditInput<T extends Entity> = (T extends { id?: any }
  ? Required<Pick<T, "id">>
  : {}) & {
  [K in keyof Omit<T, "id">]?: T[K] | null
}
export type CreateInput<T extends Entity> = {
  [K in keyof Omit<T, "id">]?: T[K] | null
}

export type MutateResponse = { itemId: number }
export type UpdateResponse = { itemId: number }
export type CreateResponse = { itemId: number }
export type DeleteResponse = { itemId: number }
export type ReplaceResponse = { itemId: number }
