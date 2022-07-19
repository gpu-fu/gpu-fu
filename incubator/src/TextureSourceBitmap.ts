/// <reference types="@webgpu/types" />

import { Context, useProp, useGPUResource, useGPUAction } from "@gpu-fu/gpu-fu"

export default function TextureSourceBitmap(ctx: Context) {
  const imageBitmap = useProp<ImageBitmap>(ctx)
  const label = useProp<string>(ctx)

  const textureWidth = imageBitmap()?.width ?? 16 // TODO: remove fallback values
  const textureHeight = imageBitmap()?.height ?? 16 // TODO: remove fallback values

  const texture = useGPUResource(
    ctx,
    (ctx) =>
      ctx.device.createTexture({
        label: label(),
        size: [textureWidth, textureHeight, 1],
        format: "rgba8unorm",
        usage:
          GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.RENDER_ATTACHMENT,
      }),
    [textureWidth, textureHeight, label()],
  )

  useGPUAction(
    ctx,
    (ctx) => {
      const currentImageBitmap = imageBitmap()
      if (!currentImageBitmap) return
      if (!texture) return

      ctx.device.queue.copyExternalImageToTexture(
        { source: currentImageBitmap },
        { texture: texture },
        [currentImageBitmap.width, currentImageBitmap.height],
      )
    },
    [imageBitmap(), texture],
  )

  return {
    imageBitmap,
    label,
    textureSourceAsGPUTexture: texture,
  }
}
