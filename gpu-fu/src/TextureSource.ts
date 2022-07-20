/// <reference types="@webgpu/types" />

import { PropertyReadOnly } from "./Property"

export default interface TextureSource {
  textureSourceAsGPUTexture: PropertyReadOnly<GPUTexture | undefined>
}
