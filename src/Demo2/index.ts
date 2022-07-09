/// <reference types="@webgpu/types" />

import runDemo from "../common/runDemo"

import TextureSourceBitmap from "../gpu-fu/TextureSourceBitmap"
import RenderTextureRect from "../gpu-fu/RenderTextureRect"
import OutputCanvas from "../gpu-fu/OutputCanvas"

runDemo(async (device, canvasContext) => {
  const textureSource = await TextureSourceBitmap.fromURL(
    "./assets/fireweed.jpg"
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
