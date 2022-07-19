/// <reference types="@webgpu/types" />

import { Context, useProp, useGPUResource, useGPUAction } from "@gpu-fu/gpu-fu"

export default function TextureSourceBitmap(ctx: Context) {
  const imageBitmap = useProp<ImageBitmap>(ctx)
  const label = useProp<string>(ctx)

  const textureWidth = imageBitmap.current?.width ?? 16 // TODO: remove fallback values
  const textureHeight = imageBitmap.current?.height ?? 16 // TODO: remove fallback values

  const texture = useGPUResource(
    ctx,
    (ctx) =>
      ctx.device.createTexture({
        label: label.current,
        size: [textureWidth, textureHeight, 1],
        format: "rgba8unorm",
        usage:
          GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.RENDER_ATTACHMENT,
      }),
    [textureWidth, textureHeight, label.current],
  )

  useGPUAction(
    ctx,
    (ctx) => {
      if (!imageBitmap.current) return
      if (!texture) return

      ctx.device.queue.copyExternalImageToTexture(
        { source: imageBitmap.current },
        { texture: texture },
        [imageBitmap.current.width, imageBitmap.current.height],
      )
    },
    [imageBitmap.current, texture],
  )

  return {
    imageBitmap,
    label,
    textureSourceAsGPUTexture: texture,
  }
}
