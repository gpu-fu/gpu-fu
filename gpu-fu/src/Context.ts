/// <reference types="@webgpu/types" />

import { Unit } from "./Unit"
import { Property, PropertyImplementation, PropertyReadOnly } from "./Property"
import { Derived, DerivedImplementation } from "./Derived"
import { OperationImplementation } from "./Operation"
import { EffectImplementation } from "./Effect"
import { Effect } from "./Effect"

export type MaybeDestroyableGPUResource =
  | undefined
  | 0
  | false
  | null
  | (GPUObjectBase & { destroy?: () => void })

type AttachDependency = Pick<
  DerivedImplementation<unknown>,
  "_attachDependency"
>

export class ContextImplementation {
  _currentAction?: AttachDependency
  _currentClockNumber: number = 1

  _effects: Effect[] = []

  _device: GPUDevice
  _commandEncoder?: GPUCommandEncoder

  constructor(device: GPUDevice) {
    // TODO: Remove this polyfill when Chromium is working properly.
    // Current versions of Chromium on Linux leave these properties undefined,
    // even though the type declarations say they are mandatory properties.
    const originalCreateBuffer = device.createBuffer.bind(device)
    ;(device as any).createBuffer = (descriptor: GPUBufferDescriptor) => {
      const result = originalCreateBuffer(descriptor)
      ;(result as any).size = descriptor.size
      ;(result as any).usage = descriptor.usage
      return result
    }

    this._device = device
  }

  get commandEncoder(): GPUCommandEncoder | undefined {
    return this._commandEncoder
  }

  get device(): GPUDevice {
    return this._device
  }

  _useProp<T>(initialValue: (() => T) | T): Property<T> {
    return new PropertyImplementation<T>(
      typeof initialValue === "function"
        ? (initialValue as () => T)()
        : initialValue,
      this,
    )
  }

  _useGPUResource<T extends MaybeDestroyableGPUResource>(
    fn: (ctx: ContextForGPUResource) => T,
  ): Derived<T> {
    return new DerivedImplementation<T>(this, fn as any)
  }

  _useGPUUpdate(
    producedProps: PropertyReadOnly<unknown>[],
    fn: (ctx: ContextForGPUAction) => void,
  ) {
    const op = new OperationImplementation(this, fn as any)

    producedProps.forEach((prop) => prop._attachProducerOperation(op))
  }

  _useEffect(fn: (ctx: ContextEmpty) => (() => void) | undefined) {
    this._effects.push(new EffectImplementation(this, fn as any))
  }
}

export type Context = Pick<
  ContextImplementation,
  // In the main function context, hooks are available.
  "device" | "_useProp" | "_useGPUResource" | "_useGPUUpdate" | "_useEffect"
>

export type ContextForGPUResource = Pick<
  ContextImplementation,
  // No hooks are available.
  "device"
>

export type ContextForGPUAction = Pick<
  ContextImplementation,
  // No hooks are available, but a command encoder is available.
  "device"
> & { commandEncoder: GPUCommandEncoder }

export type ContextEmpty = {}
