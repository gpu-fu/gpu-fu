/// <reference types="@webgpu/types" />

import runDemo from "./runDemo"

import TextureSourceBitmap from "@gpu-fu/gpu-fu/src/TextureSourceBitmap" // TODO: fix import path
import RenderTextureRect from "@gpu-fu/gpu-fu/src/RenderTextureRect" // TODO: fix import path
import OutputCanvas from "@gpu-fu/gpu-fu/src/OutputCanvas" // TODO: fix import path

runDemo(async (device, canvasContext) => {
  const textureSource = await TextureSourceBitmap.fromURL(
    "./assets/fireweed.jpg",
  )

  const renderUV = new RenderTextureRect()
  renderUV.setTextureSource(textureSource)

  const output = new OutputCanvas(canvasContext)
  output.addRender(renderUV)

  console.log(canvasContext.getCurrentTexture())

  return function frame(ctx, frame) {
    output.outputFrame(ctx, frame)
  }
})
