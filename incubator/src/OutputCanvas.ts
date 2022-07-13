/// <reference types="@webgpu/types" />

import { Context, Render } from "@gpu-fu/gpu-fu"

export default class OutputCanvas {
  _canvasContext: GPUCanvasContext
  _renders: Render[] = []

  constructor(canvasContext: GPUCanvasContext) {
    this._canvasContext = canvasContext
  }

  addRender(render: Render) {
    if (this._renders.includes(render)) return
    this._renders.push(render)
  }

  outputFrame(ctx: Context, frame: number) {
    const target = this._canvasContext.getCurrentTexture()
    this._renders.forEach((render) => {
      render.renderFrame(ctx, frame, target)
    })
  }
}
