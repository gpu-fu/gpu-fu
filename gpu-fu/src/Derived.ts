import { ContextImplementation } from "./Context"
import { Operation } from "./Operation"
import { PropertyReadOnly } from "./Property"

export type Derived<T> = PropertyReadOnly<T>

export class DerivedImplementation<T> implements Derived<T> {
  _ctx: ContextImplementation
  _fn: (ctx: unknown) => T
  _deps = new Set<PropertyReadOnly<unknown>>()
  _cachedResult?: T
  _cachedClockNumber: number = 0
  _producedClockNumber = 0
  _producerOperations: Operation[] = []

  constructor(ctx: ContextImplementation, fn: (ctx: unknown) => T) {
    this._ctx = ctx
    this._fn = fn
  }

  _attachDependency(dep: PropertyReadOnly<unknown>): void {
    this._deps.add(dep)
  }

  _attachProducerOperation(op: Operation): void {
    this._producerOperations.push(op)
  }

  _runIfNeededAt(clockNumber: number): boolean {
    if (this._cachedClockNumber >= clockNumber) return true

    var depsChanged = false
    this._deps.forEach((dep) => {
      if (dep._runIfNeededAt(clockNumber)) depsChanged = true
    })
    if (!depsChanged && this._cachedClockNumber > 0) return false

    const outerAction = this._ctx._currentAction
    this._ctx._currentAction = this

    // Run the destroy method of the previous result to clean up if applicable.
    const previousResult = this._cachedResult
    if (
      typeof previousResult === "object" &&
      "destroy" in previousResult &&
      typeof (previousResult as any).destroy === "function"
    ) {
      ;(previousResult as any).destroy()
    }

    this._cachedResult = this._fn(this._ctx)
    this._cachedClockNumber = clockNumber

    this._ctx._currentAction = outerAction

    return true
  }

  _produceIfNeededAt(clockNumber: number) {
    if (this._producedClockNumber >= clockNumber) return

    this._producerOperations.forEach((op) => op._produceIfNeededAt(clockNumber))
    this._producedClockNumber = clockNumber
  }

  get current(): T {
    const currentDerived = this._ctx._currentAction
    if (!currentDerived)
      throw new Error(
        "It's only possible to read properties from within a reactive context",
      )
    currentDerived._attachDependency(this)

    this._runIfNeededAt(this._ctx._currentClockNumber)

    return this._cachedResult as T
  }
}
