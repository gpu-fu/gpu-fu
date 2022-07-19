import { ContextImplementation } from "./Context"

export type Property<T> = Pick<
  PropertyImplementation<T, unknown>,
  "current" | "readOnly" | "set" | "change" | "mutate"
>

export type PropertyReadOnly<T> = Pick<
  PropertyImplementation<T, unknown>,
  "current" | "readOnly"
>

export class PropertyImplementation<T, U> implements Property<T> {
  private _ctx: ContextImplementation<U>
  private _current: T

  constructor(initialValue: T, ctx: ContextImplementation<U>) {
    this._current = initialValue
    this._ctx = ctx
  }

  // Get the current value of the property.
  get current(): T {
    return this._current
  }

  // Get a version of this property accessor that can only read (in TypeScript).
  get readOnly(): PropertyReadOnly<T> {
    return this
  }

  // Assign a new value to the property, notifying any reactive effects if
  // (and only if) the new value is not referentially identical to the old one.
  //
  // Use `setAndNotify` instead if you want to unconditionally notify all
  // downstream reactive effects even if the new value is the same.
  set(newValue: T) {
    if (this._current !== newValue) this.setAndNotify(newValue)
  }

  // Assign a new value to the property, notifying all reactive effects,
  // regardless of whether the new value is referentially identical to the old.
  //
  // Usually you want to use `set` instead, which checks referential identity.
  setAndNotify(newValue: T) {
    this._current = newValue
    this._ctx._needsUnitReRun = true
  }

  // Use a function to change the value of the property based on the current
  // value (which will be passed as the argument to the function).
  //
  // All reactive effects will be notified if (and only if) the new value
  // produced by the function is not referentially identical to the old value.
  //
  // Use `mutate` instead if the value is an object type that you want to mutate
  // to change it and trigger reactive effects without actually having to
  // produce a new referentially new object for the new value.
  change(fn: (currentValue: T) => T) {
    this.set(fn(this._current))
  }

  // Use a function to mutate the current value of the property,
  // without changing its referential identity.
  //
  // All reactive effects will be notified regardless of what the function does.
  mutate(fn: (currentValue: T) => unknown) {
    fn(this._current)
    this._ctx._needsUnitReRun = true // assume mutation always happens
  }
}
