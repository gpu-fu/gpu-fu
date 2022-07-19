import {
  Context,
  ContextForGPUResource,
  ContextForGPUAction,
  MaybeDestroyableGPUResource,
  ContextEmpty,
} from "./Context"
import { Unit, UnitFn, NotAUnit, unit } from "./Unit"
import { Property } from "./Property"

export function useProp<T>(ctx: Context): Property<NotAUnit<T | undefined>> {
  return ctx._useProp<T | undefined>(undefined) as Property<
    NotAUnit<T | undefined>
  >
}

export function useInitializedProp<T>(
  ctx: Context,
  initialValue: (() => NotAUnit<T>) | NotAUnit<T>,
): Property<NotAUnit<T>> {
  return ctx._useProp<NotAUnit<T>>(initialValue)
}

export function useUnitProp<U>(ctx: Context): Property<Unit<U> | undefined> {
  return ctx._useUnitProp<Unit<U> | undefined>(undefined)
}

export function useUnit<U>(ctx: Context, unitFn: UnitFn<U>): Unit<U> {
  return ctx._useUnitProp<Unit<U>>(() => unit(ctx.device, unitFn)).current
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
  setPropFn: (newValue: T) => unknown,
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
