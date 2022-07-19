/// <reference types="@webgpu/types" />

import { Property } from "./Property"

export default interface Render {
  renderTarget: Property<GPUTexture | undefined>
}
