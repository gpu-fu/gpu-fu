/// <reference types="@webgpu/types" />

import {
  OutputCanvas,
  RenderTextureRect,
  TextureSourceBitmap,
} from "@gpu-fu/incubator"

import runDemo from "./runDemo"
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
