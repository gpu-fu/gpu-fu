/// <reference types="@webgpu/types" />

import Context from "./Context"
import TextureSource from "./TextureSource"

export default class TextureSourceBitmap implements TextureSource {
  private _imageBitmap: ImageBitmap
  private _label: string

  private _texture?: GPUTexture

  constructor(imageBitmap: ImageBitmap, label: string) {
    this._imageBitmap = imageBitmap
    this._label = label
  }

  static async fromURL(url: string, label?: string) {
    const img = document.createElement("img")
    img.src = url
    await img.decode()
    const imageBitmap = await createImageBitmap(img)
    return new TextureSourceBitmap(imageBitmap, label ?? url)
  }

  textureSourceAsGPUTexture(ctx: Context): GPUTexture {
    if (this._texture) return this._texture

    this._texture = ctx.device.createTexture({
      label: this._label,
      size: [this._imageBitmap.width, this._imageBitmap.height, 1],
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    })

    ctx.device.queue.copyExternalImageToTexture(
      { source: this._imageBitmap },
      { texture: this._texture },
      [this._imageBitmap.width, this._imageBitmap.height]
    )

    console.log(this._texture)

    return this._texture
  }

  textureSourceFrame(ctx: Context, frame: number): void {}
}
