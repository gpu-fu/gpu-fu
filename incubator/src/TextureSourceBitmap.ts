/// <reference types="@webgpu/types" />

import { Context, useProp, useGPUResource, useGPUAction } from "@gpu-fu/gpu-fu"

export default function TextureSourceBitmap(ctx: Context) {
  const [imageBitmap, setImageBitmap] = useProp<ImageBitmap>(ctx)
  const [label, setLabel] = useProp<string>(ctx)

  const textureWidth = imageBitmap?.width ?? 16 // TODO: remove fallback values
  const textureHeight = imageBitmap?.height ?? 16 // TODO: remove fallback values

  const texture = useGPUResource(
    ctx,
    (ctx) =>
      ctx.device.createTexture({
        label,
        size: [textureWidth, textureHeight, 1],
        format: "rgba8unorm",
        usage:
          GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.RENDER_ATTACHMENT,
      }),
    [textureWidth, textureHeight, label],
  )

  useGPUAction(
    ctx,
    (ctx) => {
      if (!imageBitmap) return
      if (!texture) return

      ctx.device.queue.copyExternalImageToTexture(
        { source: imageBitmap },
        { texture: texture },
        [imageBitmap.width, imageBitmap.height],
      )
    },
    [imageBitmap, texture],
  )

  return {
    setImageBitmap,
    setLabel,
    textureSourceAsGPUTexture: texture,
  }
}
