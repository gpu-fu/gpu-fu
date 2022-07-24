/// <reference types="@webgpu/types" />

import runDemo from "./runDemo"

import { Context, useProp, useGPUResource, useGPUUpdate } from "@gpu-fu/gpu-fu"

import shaderModuleCode from "./demo1.wgsl"

runDemo(RenderColoredTriangle)

function RenderColoredTriangle(ctx: Context) {
  const renderTarget = useProp<GPUTexture>(ctx)

  const renderPipeline = useGPUResource(ctx, (ctx) => {
    return ctx.device.createRenderPipeline({
      layout: "auto",
      primitive: { topology: "triangle-list" },
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
    })
  })

  useGPUUpdate([renderTarget], ctx, (ctx) => {
    if (!renderTarget.current) return

    const passEncoder = ctx.commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: renderTarget.current.createView(),
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: "clear" as GPULoadOp,
          storeOp: "store" as GPUStoreOp,
        },
      ],
    })
    passEncoder.setPipeline(renderPipeline.current)
    passEncoder.draw(3, 1, 0, 0)
    passEncoder.end()
  })

  return { renderTarget }
}
