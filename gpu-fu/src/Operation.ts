import { ContextImplementation } from "./Context"
import { PropertyReadOnly } from "./Property"

export type Operation = Pick<
  OperationImplementation,
  "_produceIfNeededAt" | "_attachDependency"
>

export class OperationImplementation implements Operation {
  _ctx: ContextImplementation
  _fn: (ctx: unknown) => void
  _deps = new Set<PropertyReadOnly<unknown>>()
  _producedClockNumber: number = 0

  constructor(ctx: ContextImplementation, fn: (ctx: unknown) => void) {
    this._ctx = ctx
    this._fn = fn
  }

  _attachDependency(dep: PropertyReadOnly<unknown>): void {
    this._deps.add(dep)
  }

  _produceIfNeededAt(clockNumber: number) {
    if (this._producedClockNumber >= clockNumber) return
    this._producedClockNumber = clockNumber

    this._deps.forEach((op) => op._runIfNeededAt(clockNumber))
    this._deps.forEach((op) => op._produceIfNeededAt(clockNumber))

    const outerAction = this._ctx._currentAction
    this._ctx._currentAction = this

    this._fn(this._ctx)

    this._ctx._currentAction = outerAction
  }
}
