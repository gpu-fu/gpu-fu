/// <reference types="@webgpu/types" />

import runDemo from "./runDemo"

import { Context, Render, autoLayout } from "@gpu-fu/gpu-fu"
import { OutputCanvas } from "@gpu-fu/incubator"

import shaderModuleCode from "./demo1.wgsl"

runDemo(async (device, canvasContext) => {
  const renderTriangle = new RenderColoredTriangle()

  const output = new OutputCanvas(canvasContext)
  output.addRender(renderTriangle)

  return function frame(ctx, frame) {
    output.outputFrame(ctx, frame)
  }
})

class RenderColoredTriangle implements Render {
  _renderPipeline?: GPURenderPipeline

  getRenderPipeline(ctx: Context) {
    if (this._renderPipeline) return this._renderPipeline

    return (this._renderPipeline = ctx.device.createRenderPipeline({
      vertex: {
        module: ctx.device.createShaderModule({ code: shaderModuleCode }),
        entryPoint: "vertexRenderColoredTriangle",
      },
      fragment: {
        module: ctx.device.createShaderModule({ code: shaderModuleCode }),
        entryPoint: "fragmentRenderColoredTriangle",
        targets: [
          {
            // TODO: Remove this hard-coded value - get the real one somehow.
            format: "rgba8unorm" as GPUTextureFormat,
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
      layout: autoLayout(),
    }))
  }

  renderFrame(ctx: Context, frame: number, target: GPUTexture): void {
    const passEncoder = ctx.commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: target.createView(),
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: "clear" as GPULoadOp,
          storeOp: "store" as GPUStoreOp,
        },
      ],
    })
    passEncoder.setPipeline(this.getRenderPipeline(ctx))
    passEncoder.draw(3, 1, 0, 0)
    passEncoder.end()
  }
}
