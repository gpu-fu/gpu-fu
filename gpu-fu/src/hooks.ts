import {
  Context,
  ContextForGPUResource,
  ContextForGPUAction,
  MaybeDestroyableGPUResource,
  ContextEmpty,
  ContextImplementation,
} from "./Context"
import { Unit, UnitFn } from "./Unit"
import { Property, PropertyImplementation, PropertyReadOnly } from "./Property"

export function useProp<T>(ctx: Context): Property<T | undefined> {
  return ctx._useProp<T | undefined>(undefined) as Property<T | undefined>
}

export function useInitializedProp<T>(
  ctx: Context,
  initialValue: (() => T) | T,
): Property<T> {
  return ctx._useProp<T>(initialValue)
}

export function useUnit<U>(ctx: Context, unitFn: UnitFn<U>): Unit<U> {
  const unitProp = ctx._useProp<Unit<U>>(() => ({
    ...unitFn(ctx),
    _ctx: ctx as ContextImplementation,
  }))

  return (unitProp as PropertyImplementation<Unit<U>>)._current
}

export function useGPUResource<T extends MaybeDestroyableGPUResource>(
  ctx: Context,
  create: (ctx: ContextForGPUResource) => T,
): PropertyReadOnly<T> {
  return ctx._useGPUResource<T>(create)
}

export function useGPUUpdate(
  producedProps: PropertyReadOnly<unknown>[],
  ctx: Context,
  action: (ctx: ContextForGPUAction) => void,
): void {
  ctx._useGPUUpdate(producedProps, action)
}

export function useEffect(
  ctx: Context,
  effect: (ctx: ContextEmpty) => (() => void) | undefined,
) {
  return ctx._useEffect(effect)
}

export function useDerived<T>(
  ctx: Context,
  create: (ctx: ContextEmpty) => T,
): PropertyReadOnly<T> {
  return ctx._useDerived<T>(create)
}
