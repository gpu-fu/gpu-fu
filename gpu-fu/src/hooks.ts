import {
  Context,
  ContextForGPUResource,
  ContextForGPUAction,
  SetPropFn,
  MaybeDestroyableGPUResource,
  ContextEmpty,
} from "./Context"
import { Unit, UnitFn, NotAUnit, unit } from "./Unit"

export function useProp<T>(
  ctx: Context,
): [NotAUnit<T> | undefined, SetPropFn<NotAUnit<T> | undefined>] {
  return ctx._useProp<T | undefined>(undefined) as [
    NotAUnit<T> | undefined,
    SetPropFn<NotAUnit<T> | undefined>,
  ]
}

export function useInitializedProp<T>(
  ctx: Context,
  initialValue: (() => NotAUnit<T>) | NotAUnit<T>,
): [NotAUnit<T>, SetPropFn<NotAUnit<T>>] {
  return ctx._useProp<NotAUnit<T>>(initialValue)
}

export function useUnitProp<U>(
  ctx: Context,
): [Unit<U> | undefined, SetPropFn<Unit<U> | undefined>] {
  return ctx._useUnitProp<Unit<U> | undefined>(undefined)
}

export function useUnit<U>(ctx: Context, unitFn: UnitFn<U>): Unit<U> {
  return ctx._useUnitProp<Unit<U>>(() => unit(ctx.device, unitFn))[0]
}

export function useGPUResource<T extends MaybeDestroyableGPUResource>(
  ctx: Context,
  create: (ctx: ContextForGPUResource) => T,
  deps: Array<unknown>,
): T {
  return ctx._useGPUResource<T>(create, deps)
}

export function useGPUAction(
  ctx: Context,
  action: (ctx: ContextForGPUAction) => void,
  deps: Array<unknown>,
): void {
  ctx._useGPUAction(action, deps)
}

export function useEffect<T>(
  ctx: Context,
  effect: (ctx: ContextEmpty) => (() => void) | undefined,
  deps: Array<unknown>,
) {
  return ctx._useEffect(effect, deps)
}

export function useAsyncPropSetter<T>(
  ctx: Context,
  setPropFn: SetPropFn<T>,
  effect: (ctx: ContextEmpty) => Promise<T>,
  deps: Array<unknown>,
) {
  return ctx._useEffect((ctx) => {
    var cancelled = false
    effect(ctx)
      .then((value) => cancelled || setPropFn(value))
      .catch((error) => {
        console.error(error)
        cancelled = true
      })
    return () => {
      cancelled = true
    }
  }, deps)
}
