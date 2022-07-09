/// <reference types="@webgpu/types" />

export default interface Context {
  device: GPUDevice
  commandEncoder: GPUCommandEncoder
}
