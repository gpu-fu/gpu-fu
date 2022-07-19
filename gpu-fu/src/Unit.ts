import { Context, ContextImplementation } from "./Context"

export type UnitAny = {
  _ctx: Context
}

export type Unit<U> = U & {
  _ctx: ContextImplementation<U>
}

export type UnitRoot<U> = U & {
  _ctx: ContextImplementation<U>
  runFrame: (commandEncoder: GPUCommandEncoder) => void
}

export type UnitFn<U> = (ctx: Context) => U

export type NotAUnit<T> = T extends UnitAny ? never : T

export function unit<U>(
  device: GPUDevice,
  unitFn: (ctx: Context) => U,
): Unit<U> {
  const ctx = new ContextImplementation<U>(unitFn, device)
  return { ...unitFn(ctx), _ctx: ctx }
}

function unitFrame<U>(unit: Unit<U>, commandEncoder: GPUCommandEncoder) {
  const ctx = unit._ctx
  ctx.runUnitIfNeeded(unit)
  ctx.runGPUActionsIfNeeded(commandEncoder)
}

export function createUnitRoot<U>(
  device: GPUDevice,
  unitFn: (ctx: Context) => U,
): UnitRoot<U> {
  const ctx = new ContextImplementation<U>(unitFn, device)
  const unitRoot = { ...unitFn(ctx), _ctx: ctx } as UnitRoot<U>
  unitRoot.runFrame = (commandEncoder: GPUCommandEncoder) =>
    unitFrame(unitRoot, commandEncoder)
  return unitRoot
}
