import { ContextImplementation } from "./Context"
import { PropertyReadOnly } from "./Property"

export type Effect = Pick<
  EffectImplementation,
  "_attachDependency" | "_runIfNeededAt"
>

export class EffectImplementation implements Effect {
  _ctx: ContextImplementation
  _fn: (ctx: unknown) => (() => {}) | undefined
  _deps = new Set<PropertyReadOnly<unknown>>()
  _lastCancelFn?: () => {}
  _lastClockNumber = 0

  constructor(
    ctx: ContextImplementation,
    fn: (ctx: unknown) => (() => {}) | undefined,
  ) {
    this._ctx = ctx
    this._fn = fn
  }

  _attachDependency(dep: PropertyReadOnly<unknown>): void {
    this._deps.add(dep)
  }

  _runIfNeededAt(clockNumber: number) {
    if (this._lastClockNumber >= clockNumber) return true

    var depsChanged = false
    this._deps.forEach((dep) => {
      if (dep._runIfNeededAt(clockNumber)) depsChanged = true
    })
    if (!depsChanged && this._lastClockNumber > 0) return false

    const lastCancelFn = this._lastCancelFn
    if (lastCancelFn) lastCancelFn()

    const outerAction = this._ctx._currentAction
    this._ctx._currentAction = this

    this._lastCancelFn = this._fn(this._ctx)

    this._ctx._currentAction = outerAction
    this._lastClockNumber = clockNumber
  }
}
