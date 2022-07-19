/// <reference types="@webgpu/types" />

import { Unit } from "./Unit"
import { Property } from "./Property"

export type MaybeDestroyableGPUResource =
  | undefined
  | 0
  | false
  | null
  | (GPUObjectBase & { destroy?: () => void })
export type StoreItemGPUResource<T extends MaybeDestroyableGPUResource> = [
  T,
  unknown[],
]

export type StoreItemGPUAction = [
  (ctx: ContextForGPUAction) => void,
  unknown[],
  boolean,
]

export type StoreItemEffect = [(() => void) | undefined, unknown[]]

export class ContextImplementation<U> {
  private _unitFn: (ctx: Context) => U

  device: GPUDevice
  commandEncoder?: GPUCommandEncoder

  constructor(unitFn: (ctx: Context) => U, device: GPUDevice) {
    this._unitFn = unitFn
    this.device = device
  }

  ///
  // This next section relates to private storage of state and effects.

  private _store: unknown[] = []
  private _storeIndex = 0
  private _storeUnits: Property<Unit<unknown> | undefined>[] = []
  private _storeUnitsIndex = 0
  private _storeGPUActions: StoreItemGPUAction[] = []
  private _storeGPUActionsIndex = 0
  private _needsUnitReRun = true

  private _nextStoreIndex() {
    const storeIndex = this._storeIndex
    this._storeIndex = storeIndex + 1
    return storeIndex
  }

  private _nextStoreUnitsIndex() {
    const storeUnitsIndex = this._storeUnitsIndex
    this._storeUnitsIndex = storeUnitsIndex + 1
    return storeUnitsIndex
  }

  private _nextStoreGPUActionsIndex() {
    const storeGPUActionsIndex = this._storeGPUActionsIndex
    this._storeGPUActionsIndex = storeGPUActionsIndex + 1
    return storeGPUActionsIndex
  }

  ///
  // This next section has public methods related to running the unit.

  runUnitIfNeeded(currentUnit: U) {
    var otherUnitsRan = false
    this._storeUnits.forEach((unitProp) => {
      const unit = unitProp()
      const otherUnitRan = unit?._ctx.runUnitIfNeeded(unit)
      if (otherUnitRan) otherUnitsRan = true
    })

    if (this._needsUnitReRun || otherUnitsRan) {
      this._storeIndex = 0
      this._storeUnitsIndex = 0
      this._storeGPUActionsIndex = 0
      this._needsUnitReRun = false
      Object.assign(currentUnit, this._unitFn(this))
      return true
    } else {
      return false
    }
  }

  runGPUActionsIfNeeded(commandEncoder: GPUCommandEncoder) {
    this._storeUnits.forEach((unitProp) => {
      const unit = unitProp()
      unit?._ctx.runGPUActionsIfNeeded(commandEncoder)
    })

    this.commandEncoder = commandEncoder
    this._storeGPUActions.forEach(([action, deps, needsRun], index) => {
      if (needsRun) {
        action(this as ContextForGPUAction)
        this._storeGPUActions[index][2] = false
      }
    })
    this.commandEncoder = undefined
  }

  ///
  // This next section has public methods

  _useProp<T>(initialValue: (() => T) | T): Property<T> {
    const storeIndex = this._nextStoreIndex()
    const existing = this._store[storeIndex] as Property<T>

    // If there is an existing property pair, return it now.
    if (existing) return existing

    // Otherwise create, store, and return a new prop/setProp pair,
    // using the provided initial state value or function.
    const ctx = this

    var value: T =
      typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue

    // TODO: Subscription tracking
    const prop: Property<T> = (() => value) as Property<T>
    prop.set = (newValue: T) => {
      if (value !== newValue) {
        value = newValue
        ctx._needsUnitReRun = true
      }
    }
    prop.change = (fn: (currentValue: T) => T) => {
      const newValue = fn(value)
      if (value !== newValue) {
        value = newValue
        ctx._needsUnitReRun = true
      }
    }
    prop.mutate = (fn: (currentValue: T) => void) => {
      fn(value)
      ctx._needsUnitReRun = true // assume mutation always happens
    }

    this._store[storeIndex] = prop
    return prop
  }

  _useUnitProp<T extends Unit<unknown> | undefined>(
    initialValue: (() => T) | T,
  ): Property<T> {
    const storeIndex = this._nextStoreUnitsIndex()
    const existing = this._storeUnits[storeIndex] as Property<T>

    // If there is an existing prop/setProp pair, return it now.
    if (existing) return existing

    // Otherwise create, store, and return a new prop/setProp pair,
    // using the provided initial state value or function.
    const ctx = this

    var value: T =
      typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue

    // TODO: Subscription tracking
    const prop: Property<T> = (() => value) as Property<T>
    prop.set = (newValue: T) => {
      if (value !== newValue) {
        value = newValue
        ctx._needsUnitReRun = true
      }
    }
    prop.change = (fn: (currentValue: T) => T) => {
      const newValue = fn(value)
      if (value !== newValue) {
        value = newValue
        ctx._needsUnitReRun = true
      }
    }
    prop.mutate = (fn: (currentValue: T) => void) => {
      fn(value)
      ctx._needsUnitReRun = true // assume mutation always happens
    }

    this._storeUnits[storeIndex] = prop
    return prop
  }

  _useGPUResource<T extends MaybeDestroyableGPUResource>(
    create: (ctx: ContextForGPUResource) => T,
    deps: Array<unknown>,
  ): T {
    const storeIndex = this._nextStoreIndex()
    const existing = this._store[storeIndex] as StoreItemGPUResource<T>

    // If the resource has never been created, create it now.
    if (!existing) {
      const newResource = create(this)
      this._store[storeIndex] = [newResource, deps]
      return newResource
    }

    // If the resource exists, and all new dependencies have the same identity
    // as the corresponding old dependencies, return the existing resource.
    if (deps.every((dep, index) => dep === existing[1][index]))
      return existing[0]

    // Create the new resource and store it along with its dependencies.
    const newResource = create(this)
    const oldResource = existing[0]
    existing[0] = newResource
    existing[1] = deps

    // Destroy the old resource if applicable.
    if (oldResource && typeof oldResource.destroy === "function")
      oldResource.destroy()

    // Return the new resource
    return newResource
  }

  _useGPUAction(
    action: (ctx: ContextForGPUAction) => void,
    deps: Array<unknown>,
  ): void {
    const storeIndex = this._nextStoreGPUActionsIndex()
    const existing = this._storeGPUActions[storeIndex] as StoreItemGPUAction

    // If the action has never been stored, store it now and return early.
    if (!existing) {
      this._storeGPUActions[storeIndex] = [action, deps, true]
      return
    }

    // If the action is known, and all new dependencies have the same identity
    // as the corresponding old dependencies, return without doing anything.
    if (deps.every((dep, index) => dep === existing[1][index])) return

    // Update the action function along with its dependencies,
    // and mark it as being "dirty" (i.e. in need of being executed again).
    existing[0] = action
    existing[1] = deps
    existing[2] = true
    return
  }

  _useEffect(
    effect: (ctx: ContextEmpty) => (() => void) | undefined,
    deps: Array<unknown>,
  ) {
    const storeIndex = this._nextStoreIndex()
    const existing = this._store[storeIndex] as StoreItemEffect

    // If the effect has never been stored, store it now after executing.
    if (!existing) {
      const cancelFn = effect({})
      this._store[storeIndex] = [cancelFn, deps]
      return
    }

    // If the effect is known, and all new dependencies have the same identity
    // as the corresponding old dependencies, return without doing anything.
    if (deps.every((dep, index) => dep === existing[1][index])) return

    // Call the existing cancel function if there is one.
    if (existing[0]) existing[0]()

    // Execute the effect function to get the new cancel function, then
    // store it along with the new dependency identities.
    existing[0] = effect({})
    existing[1] = deps
    return
  }
}

export type Context = Pick<
  ContextImplementation<unknown>,
  // In the main function context, hooks are available.
  | "device"
  | "_useProp"
  | "_useUnitProp"
  | "_useGPUResource"
  | "_useGPUAction"
  | "_useEffect"
>

export type ContextForGPUResource = Pick<
  ContextImplementation<unknown>,
  // No hooks are available.
  "device"
>

export type ContextForGPUAction = Pick<
  ContextImplementation<unknown>,
  // No hooks are available, but a command encoder is available.
  "device"
> & { commandEncoder: GPUCommandEncoder }

export type ContextEmpty = {}
