export interface Property<T> {
  (): T
  set(newValue: T): void
  change(fn: (currentValue: T) => T): void
  mutate(fn: (currentValue: T) => void): void
}
