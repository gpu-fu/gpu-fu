/// <reference types="@webgpu/types" />

import {
  Context,
  MatrixSource,
  VertexSource,
  TextureSource,
  autoLayout,
  useProp,
  useUnitProp,
  useGPUResource,
  useGPUAction,
} from "@gpu-fu/gpu-fu"

import shaderModuleCode from "./RenderUV.wgsl"

export default function RenderUV(ctx: Context) {
  const cameraSource = useUnitProp<MatrixSource>(ctx)
  const vertexSource = useUnitProp<VertexSource>(ctx)
  const textureSource = useUnitProp<TextureSource>(ctx)
  const renderTarget = useProp<GPUTexture>(ctx)

  const cameraSourceAsGPUBuffer = cameraSource.current?.cameraSourceAsGPUBuffer
  const textureSourceAsGPUTexture =
    textureSource.current?.textureSourceAsGPUTexture

  const shaderModule = useGPUResource(
    ctx,
    (ctx) =>
      ctx.device.createShaderModule({
        code: shaderModuleCode,
      }),
    [],
  )

  const renderPipeline = useGPUResource(
    ctx,
    (ctx) => {
      if (!vertexSource.current) return

      return ctx.device.createRenderPipeline({
        vertex: {
          module: shaderModule,
          entryPoint: cameraSourceAsGPUBuffer
            ? "vertexRenderUVWithMatrix"
            : "vertexRenderUV",
          buffers: [
            {
              arrayStride: vertexSource.current.vertexSourceStrideBytes,
              attributes: [
                {
                  shaderLocation: 0,
                  offset: vertexSource.current.vertexSourceXYZWOffsetBytes,
                  format: "float32x4" as GPUVertexFormat,
                },
                {
                  shaderLocation: 1,
                  offset: vertexSource.current.vertexSourceUVOffsetBytes,
                  format: "float32x2" as GPUVertexFormat,
                },
              ],
            },
          ],
        },
        fragment: {
          module: shaderModule,
          entryPoint: "fragmentRenderUV",
          targets: [
            {
              // TODO: Remove this hard-coded value - get the real one somehow.
              format: "rgba8unorm" as GPUTextureFormat,
            },
          ],
        },
        primitive: {
          topology: "triangle-list",
          // TODO: Configurable `cullMode`
        },
        depthStencil: {
          depthWriteEnabled: true,
          depthCompare: "less",
          format: "depth24plus",
        },
        layout: autoLayout(),
      })
    },
    [shaderModule, vertexSource.current],
  )

  const sampler = useGPUResource(
    ctx,
    (ctx) =>
      ctx.device.createSampler({
        magFilter: "linear",
        minFilter: "linear",
      }),
    [],
  )

  const bindGroup = useGPUResource(
    ctx,
    (ctx) => {
      if (!renderPipeline) return
      if (!textureSourceAsGPUTexture) return

      const entries: GPUBindGroupEntry[] = [
        {
          binding: 1,
          resource: sampler,
        },
        {
          binding: 2,
          resource: textureSourceAsGPUTexture.createView(),
        },
      ]
      if (cameraSourceAsGPUBuffer)
        entries.unshift({
          binding: 0,
          resource: { buffer: cameraSourceAsGPUBuffer },
        })

      return ctx.device.createBindGroup({
        layout: renderPipeline.getBindGroupLayout(0),
        entries,
      })
    },

    [
      renderPipeline,
      cameraSourceAsGPUBuffer,
      textureSourceAsGPUTexture,
      sampler,
    ],
  )

  const depthTexture = useGPUResource(
    ctx,
    (ctx) =>
      ctx.device.createTexture({
        size: [300, 300], // TODO: somehow get from canvas client size
        format: "depth24plus",
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      }),
    [],
  )

  useGPUAction(
    ctx,
    (ctx) => {
      if (!vertexSource.current) return
      if (!renderTarget.current) return
      if (!renderPipeline) return
      if (!bindGroup) return

      const passEncoder = ctx.commandEncoder.beginRenderPass({
        colorAttachments: [
          {
            view: renderTarget.current.createView(),
            clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
            loadOp: "clear" as GPULoadOp,
            storeOp: "store" as GPUStoreOp,
          },
        ],
        depthStencilAttachment: {
          view: depthTexture.createView(),
          depthClearValue: 1.0,
          depthLoadOp: "clear" as GPULoadOp,
          depthStoreOp: "store" as GPUStoreOp,
        },
      })
      passEncoder.setPipeline(renderPipeline)
      passEncoder.setVertexBuffer(
        0,
        vertexSource.current.vertexSourceAsGPUBuffer,
      )
      passEncoder.setBindGroup(0, bindGroup)
      passEncoder.draw(vertexSource.current.vertexSourceCount, 1, 0, 0)
      passEncoder.end()
    },
    [vertexSource.current, renderTarget.current, renderPipeline, bindGroup],
  )

  return {
    cameraSource,
    textureSource,
    vertexSource,
    renderTarget,
  }
}
