import { ContextImplementation } from "./Context"

export type Property<T> = Pick<
  PropertyImplementation<T, unknown>,
  "current" | "set" | "change" | "mutate"
>

export class PropertyImplementation<T, U> implements Property<T> {
  private _ctx: ContextImplementation<U>
  private _current: T

  constructor(initialValue: T, ctx: ContextImplementation<U>) {
    this._current = initialValue
    this._ctx = ctx
  }

  get current(): T {
    return this._current
  }

  set(newValue: T) {
    if (this._current !== newValue) {
      this._current = newValue
      this._ctx._needsUnitReRun = true
    }
  }

  change(fn: (currentValue: T) => T) {
    const newValue = fn(this._current)
    if (this._current !== newValue) {
      this._current = newValue
      this._ctx._needsUnitReRun = true
    }
  }

  mutate(fn: (currentValue: T) => void) {
    fn(this._current)
    this._ctx._needsUnitReRun = true // assume mutation always happens
  }
}
