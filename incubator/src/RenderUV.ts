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
  const [cameraSource, setCameraMatrixSource] = useUnitProp<MatrixSource>(ctx)
  const [vertexSource, setVertexSource] = useUnitProp<VertexSource>(ctx)
  const [textureSource, setTextureSource] = useUnitProp<TextureSource>(ctx)
  const [renderTarget, setRenderTarget] = useProp<GPUTexture>(ctx)

  const cameraSourceAsGPUBuffer = cameraSource?.cameraSourceAsGPUBuffer
  const textureSourceAsGPUTexture = textureSource?.textureSourceAsGPUTexture

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
    (ctx) =>
      vertexSource &&
      ctx.device.createRenderPipeline({
        vertex: {
          module: shaderModule,
          entryPoint: cameraSourceAsGPUBuffer
            ? "vertexRenderUVWithMatrix"
            : "vertexRenderUV",
          buffers: [
            {
              arrayStride: vertexSource.vertexSourceStrideBytes,
              attributes: [
                {
                  shaderLocation: 0,
                  offset: vertexSource.vertexSourceXYZWOffsetBytes,
                  format: "float32x4" as GPUVertexFormat,
                },
                {
                  shaderLocation: 1,
                  offset: vertexSource.vertexSourceUVOffsetBytes,
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
      }),
    [shaderModule, vertexSource],
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
      if (!textureSource) return
      if (!vertexSource) return
      if (!renderPipeline) return
      if (!bindGroup) return
      if (!renderTarget) return

      const passEncoder = ctx.commandEncoder.beginRenderPass({
        colorAttachments: [
          {
            view: renderTarget.createView(),
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
      passEncoder.setVertexBuffer(0, vertexSource.vertexSourceAsGPUBuffer)
      passEncoder.setBindGroup(0, bindGroup)
      passEncoder.draw(vertexSource.vertexSourceCount, 1, 0, 0)
      passEncoder.end()
    },
    [textureSource, vertexSource, renderPipeline, bindGroup, renderTarget],
  )

  return {
    setCameraMatrixSource,
    setTextureSource,
    setVertexSource,
    setRenderTarget,
  }
}
