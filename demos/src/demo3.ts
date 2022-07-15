/// <reference types="@webgpu/types" />

import { useUnit } from "@gpu-fu/gpu-fu"
import {
  TextureSourceBitmapFromURL,
  TextureFilterConvolve,
  RenderTextureRect,
} from "@gpu-fu/incubator"

import runDemo from "./runDemo"
runDemo((ctx) => {
  const textureSource = useUnit(ctx, TextureSourceBitmapFromURL)
  textureSource.setURL("./assets/fireweed.jpg")

  const sobelHorizontal = useUnit(ctx, TextureFilterConvolve)
  sobelHorizontal.setTextureSource(textureSource)
  sobelHorizontal.setKernel3x3(
    // Sobel Horizontal Kernel (with scaling and bias to center on gray)
    [1, 2, 1],
    [0, 0, 0],
    [-1, -2, -1],
    { scale: 0.5, bias: 0.5 },
  )

  const { setRenderTarget, ...render } = useUnit(ctx, RenderTextureRect)
  render.setTextureSource(sobelHorizontal)

  return { setRenderTarget }
})
