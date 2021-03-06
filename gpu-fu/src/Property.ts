import { ContextImplementation } from "./Context"
import { Operation } from "./Operation"

export type Property<T> = Pick<
  PropertyImplementation<T>,
  | "current"
  | "getNonReactively"
  | "readOnly"
  | "setFrom"
  | "set"
  | "setAndNotify"
  | "change"
  | "mutate"
  | "_runIfNeededAt"
  | "_produceIfNeededAt"
  | "_attachProducerOperation"
>

export type PropertyReadOnly<T> = Pick<
  PropertyImplementation<T>,
  | "current"
  | "getNonReactively"
  | "_runIfNeededAt"
  | "_produceIfNeededAt"
  | "_attachProducerOperation"
>

export class PropertyImplementation<T> implements Property<T> {
  private _ctx: ContextImplementation
  _current: T // TODO: private
  private _next: T
  private _changeAtNextTick = false
  private _changedClockNumber = 0
  private _producedClockNumber = 0
  private _producerOperations: Operation[] = []
  private _readingFrom?: PropertyReadOnly<T>

  constructor(initialValue: T, ctx: ContextImplementation) {
    this._current = initialValue
    this._next = initialValue
    this._ctx = ctx
  }

  _attachProducerOperation(op: Operation): void {
    this._producerOperations.push(op)
  }

  _runIfNeededAt(clockNumber: number): boolean {
    const readingFrom = this._readingFrom
    if (readingFrom && !this._changeAtNextTick)
      return readingFrom._runIfNeededAt(clockNumber)

    if (!this._changeAtNextTick) return this._changedClockNumber >= clockNumber

    delete this._readingFrom
    this._current = this._next
    this._changeAtNextTick = false
    this._changedClockNumber = clockNumber

    return true
  }

  _produceIfNeededAt(clockNumber: number): boolean {
    if (this._producedClockNumber >= clockNumber) return true

    var depsChanged = false
    if (this._readingFrom?._produceIfNeededAt(clockNumber)) depsChanged = true
    this._producerOperations.forEach((op) => {
      if (op._produceIfNeededAt(clockNumber)) depsChanged = true
    })

    if (
      !depsChanged &&
      this._changedClockNumber < clockNumber &&
      this._producedClockNumber > 0
    )
      return false

    this._producedClockNumber = clockNumber
    return true
  }

  // Get the current value of the property.
  //
  // This can only be accessed from within a reactive context,
  // since it implies that you want to track the property as a dependency
  // dependency that will cause the reactive context to be called again.
  // To get the current value non-reactively, call `getNonReactively` instead.
  get current(): T {
    const currentAction = this._ctx._currentAction
    if (!currentAction)
      throw new Error(
        "It's only possible to read properties from within a reactive context",
      )
    currentAction._attachDependency(this)

    const readingFrom = this._readingFrom
    if (readingFrom) return readingFrom.current

    return this._current
  }

  // Get the current value of the property without dependency tracking.
  // Unlike the `current` getter, this can be called anywhere,
  // both in contexts which are reactive and non-reactive.
  // But if called in a reactive context, there is no dependency link created.
  getNonReactively(): T {
    const readingFrom = this._readingFrom
    if (readingFrom) return readingFrom.getNonReactively()

    return this._current
  }

  // Get a version of this property accessor that can only read (in TypeScript).
  get readOnly(): PropertyReadOnly<T> {
    return this
  }

  // TODO: Document
  setFrom(other: PropertyReadOnly<T>) {
    this._readingFrom = other
  }

  // Assign a new value to the property, notifying any reactive effects if
  // (and only if) the new value is not referentially identical to the old one.
  //
  // Use `setAndNotify` instead if you want to unconditionally notify all
  // downstream reactive effects even if the new value is the same.
  set(newValue: T) {
    if (this._current !== newValue) {
      this._next = newValue
      this.notify()
    }
  }

  // Assign a new value to the property, notifying all reactive effects,
  // regardless of whether the new value is referentially identical to the old.
  //
  // Usually you want to use `set` instead, which checks referential identity.
  setAndNotify(newValue: T) {
    this._next = newValue
    this.notify()
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
    if (this._readingFrom)
      throw new Error(
        "changing a property that was set from another property is not yet supported",
      )
    this.set(fn(this._current))
  }

  // Use a function to mutate the current value of the property,
  // without changing its referential identity.
  //
  // All reactive effects will be notified regardless of what the function does.
  mutate(fn: (currentValue: T) => unknown) {
    if (this._readingFrom)
      throw new Error(
        "mutating a property that was set from another property is not yet supported",
      )
    fn(this._current)
    this.notify() // assume mutation always happens
  }

  private notify() {
    this._changeAtNextTick = true
  }
}
