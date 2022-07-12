/// <reference types="@webgpu/types" />

import TextureSource from "./TextureSource"

export default interface TextureFilter extends TextureSource {
  setTextureSource(textureSource: TextureSource): void
}
