/**
 * extracts the union of object's value types
 * see https://stackoverflow.com/questions/50044023/get-union-type-from-indexed-object-values
 */
export type ValueOf<T> = T[keyof T]
