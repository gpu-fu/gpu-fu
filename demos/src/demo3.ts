/// <reference types="@webgpu/types" />

import runDemo from "./runDemo"

import TextureSourceBitmap from "@gpu-fu/gpu-fu/src/TextureSourceBitmap" // TODO: fix import path
import TextureFilterConvolve from "@gpu-fu/gpu-fu/src/TextureFilterConvolve" // TODO: fix import path
import RenderTextureRect from "@gpu-fu/gpu-fu/src/RenderTextureRect" // TODO: fix import path
import OutputCanvas from "@gpu-fu/gpu-fu/src/OutputCanvas" // TODO: fix import path

runDemo(async (device, canvasContext) => {
  const textureSource = await TextureSourceBitmap.fromURL(
    "./assets/fireweed.jpg",
  )

  const sobelHorizontal = new TextureFilterConvolve()
  sobelHorizontal.setTextureSource(textureSource)
  sobelHorizontal.setKernel3x3(
    // Sobel Horizontal Kernel (with scaling and bias to center on gray)
    [1, 2, 1],
    [0, 0, 0],
    [-1, -2, -1],
    { scale: 0.5, bias: 0.5 },
  )

  const renderUV = new RenderTextureRect()
  renderUV.setTextureSource(sobelHorizontal)

  const output = new OutputCanvas(canvasContext)
  output.addRender(renderUV)

  console.log(canvasContext.getCurrentTexture())

  return function frame(ctx, frame) {
    output.outputFrame(ctx, frame)
  }
})
