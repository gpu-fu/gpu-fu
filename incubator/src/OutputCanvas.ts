/// <reference types="@webgpu/types" />

import { Render, UnitRoot } from "@gpu-fu/gpu-fu"

export default class OutputCanvas {
  _canvasContext: GPUCanvasContext
  _renders: UnitRoot<Render>[] = []

  constructor(canvasContext: GPUCanvasContext) {
    this._canvasContext = canvasContext
  }

  addRender(render: UnitRoot<Render>) {
    if (this._renders.includes(render)) return
    this._renders.push(render)
  }

  outputFrame(commandEncoder: GPUCommandEncoder) {
    const target = this._canvasContext.getCurrentTexture()
    this._renders.forEach((render) => {
      render.renderTarget.set(target)
      render.runFrame(commandEncoder)
    })
  }
}
