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

    // TODO: remove this polyfill when Chromium is working properly.
    // Current versions of Chromium on Linux leave these properties undefined,
    // even though the type declarations say they are mandatory properties.
    ;(target as any).width = (this._canvasContext.canvas as any).width
    ;(target as any).height = (this._canvasContext.canvas as any).height
    ;(target as any).format = "rgba8unorm"

    this._renders.forEach((render) => {
      render.renderTarget.setAndNotify(target)
      render.runFrame(commandEncoder, [render.renderTarget])
    })
  }
}
