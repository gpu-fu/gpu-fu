import { Context, ContextImplementation } from "./Context"
import { PropertyReadOnly } from "./Property"

export type Unit<U> = U & {
  _ctx: ContextImplementation
}

export type UnitRoot<U> = U & {
  _ctx: ContextImplementation
  runFrame: (
    commandEncoder: GPUCommandEncoder,
    outputs: PropertyReadOnly<unknown>[],
  ) => void
}

export type UnitFn<U> = (ctx: Context) => U

export function createUnitRoot<U>(
  device: GPUDevice,
  unitFn: UnitFn<U>,
): UnitRoot<U> {
  const ctx = new ContextImplementation(device)
  const unitRoot = { ...unitFn(ctx), _ctx: ctx } as UnitRoot<U>
  unitRoot.runFrame = (
    commandEncoder: GPUCommandEncoder,
    outputs: PropertyReadOnly<unknown>[],
  ) => {
    ctx._currentClockNumber += 1
    ctx._commandEncoder = commandEncoder

    const clockNumber = ctx._currentClockNumber
    outputs.forEach((output) => output._produceIfNeededAt(clockNumber))

    ctx._effects.forEach((effect) => effect._runIfNeededAt(clockNumber))

    ctx._commandEncoder = undefined
  }
  return unitRoot
}
