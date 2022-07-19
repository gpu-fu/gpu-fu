/// <reference types="@webgpu/types" />

import { useEffect, useUnit } from "@gpu-fu/gpu-fu"
import {
  TextureSourceBitmapFromURL,
  TextureFilterConvolve,
  RenderTextureRect,
} from "@gpu-fu/incubator"

import runDemo from "./runDemo"
runDemo((ctx) => {
  const textureSource = useUnit(ctx, TextureSourceBitmapFromURL)
  textureSource.url.set("./assets/fireweed.jpg")

  const sobelHorizontal = useUnit(ctx, TextureFilterConvolve)
  sobelHorizontal.textureSource.set(textureSource)
  sobelHorizontal.setKernel3x3(
    // Sobel Horizontal Kernel (with scaling and bias to center on gray)
    [1, 2, 1],
    [0, 0, 0],
    [-1, -2, -1],
    { scale: 0.5, bias: 0.5 },
  )

  const { renderTarget, ...render } = useUnit(ctx, RenderTextureRect)
  render.textureSource.set(sobelHorizontal)

  return { renderTarget }
})
