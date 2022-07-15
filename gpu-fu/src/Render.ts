/// <reference types="@webgpu/types" />

export default interface Render {
  setRenderTarget: (target: GPUTexture) => void
}
