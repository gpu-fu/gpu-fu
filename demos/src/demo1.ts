/// <reference types="@webgpu/types" />

import runDemo from "./runDemo"

import {
  Context,
  autoLayout,
  useProp,
  useGPUResource,
  useGPUAction,
} from "@gpu-fu/gpu-fu"

import shaderModuleCode from "./demo1.wgsl"

runDemo(RenderColoredTriangle)

function RenderColoredTriangle(ctx: Context) {
  const renderTarget = useProp<GPUTexture>(ctx)

  const renderPipeline = useGPUResource(
    ctx,
    (ctx) =>
      ctx.device.createRenderPipeline({
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
      }),
    [],
  )

  useGPUAction(
    ctx,
    (ctx) => {
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
      passEncoder.setPipeline(renderPipeline)
      passEncoder.draw(3, 1, 0, 0)
      passEncoder.end()
    },
    [renderTarget.current],
  )

  return { renderTarget }
}
