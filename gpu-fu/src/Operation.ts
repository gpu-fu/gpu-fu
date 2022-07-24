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

  _produceIfNeededAt(clockNumber: number): boolean {
    if (this._producedClockNumber >= clockNumber) return false
    const originalClockNumber = this._producedClockNumber
    this._producedClockNumber = clockNumber

    var depsChanged = false
    this._deps.forEach((op) => {
      if (op._runIfNeededAt(clockNumber)) depsChanged = true
    })
    this._deps.forEach((op) => {
      if (op._produceIfNeededAt(clockNumber)) depsChanged = true
    })
    if (!depsChanged && originalClockNumber > 0) return false

    const outerAction = this._ctx._currentAction
    this._ctx._currentAction = this

    this._fn(this._ctx)

    this._ctx._currentAction = outerAction

    return true
  }
}
