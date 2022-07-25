/// <reference types="@webgpu/types" />

import { Context, useProp, useGPUResource, useGPUUpdate } from "@gpu-fu/gpu-fu"

export default function TextureSourceBitmap(ctx: Context) {
  const imageBitmap = useProp<ImageBitmap>(ctx)
  const label = useProp<string>(ctx)

  const texture = useGPUResource(ctx, (ctx) => {
    if (!imageBitmap.current) return

    return ctx.device.createTexture({
      label: label.current,
      size: {
        width: imageBitmap.current.width,
        height: imageBitmap.current.height,
      },
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    })
  })

  useGPUUpdate([texture], ctx, (ctx) => {
    if (!imageBitmap.current) return
    if (!texture.current) return

    ctx.device.queue.copyExternalImageToTexture(
      { source: imageBitmap.current },
      { texture: texture.current },
      {
        width: imageBitmap.current.width,
        height: imageBitmap.current.height,
      },
    )
  })

  return {
    imageBitmap,
    label,
    resultTexture: texture,
  }
}
