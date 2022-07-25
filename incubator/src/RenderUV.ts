/// <reference types="@webgpu/types" />

import {
  Context,
  useProp,
  useGPUResource,
  useGPUUpdate,
  VertexBufferLayout,
} from "@gpu-fu/gpu-fu"

import shaderModuleCode from "./RenderUV.wgsl"

export default function RenderUV(ctx: Context) {
  const cameraMatrixBuffer = useProp<GPUBuffer>(ctx)
  const vertexBuffer = useProp<GPUBuffer>(ctx)
  const vertexBufferLayout = useProp<VertexBufferLayout>(ctx)
  const textureSource = useProp<GPUTexture>(ctx)
  const renderTarget = useProp<GPUTexture>(ctx)

  const shaderModule = useGPUResource(ctx, (ctx) =>
    ctx.device.createShaderModule({
      code: shaderModuleCode,
    }),
  )

  const renderPipeline = useGPUResource(ctx, (ctx) => {
    if (!vertexBufferLayout.current) return
    if (!renderTarget.current) return

    return ctx.device.createRenderPipeline({
      layout: "auto",
      primitive: {
        topology: "triangle-list",
        // TODO: Configurable `cullMode`
      },
      vertex: {
        module: shaderModule.current,
        entryPoint: cameraMatrixBuffer.current
          ? "vertexRenderUVWithMatrix"
          : "vertexRenderUV",
        buffers: [
          {
            arrayStride: vertexBufferLayout.current.strideBytes,
            attributes: [
              {
                shaderLocation: 0,
                offset: vertexBufferLayout.current.xyzwOffsetBytes,
                format: "float32x4" as GPUVertexFormat,
              },
              {
                shaderLocation: 1,
                offset: vertexBufferLayout.current.uvOffsetBytes,
                format: "float32x2" as GPUVertexFormat,
              },
            ],
          },
        ],
      },
      fragment: {
        module: shaderModule.current,
        entryPoint: "fragmentRenderUV",
        targets: [{ format: renderTarget.current.format }],
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth24plus",
      },
    })
  })

  const sampler = useGPUResource(ctx, (ctx) =>
    ctx.device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
    }),
  )

  const bindGroup = useGPUResource(ctx, (ctx) => {
    if (!renderPipeline.current) return
    if (!textureSource.current) return

    const entries: GPUBindGroupEntry[] = [
      {
        binding: 1,
        resource: sampler.current,
      },
      {
        binding: 2,
        resource: textureSource.current.createView(),
      },
    ]
    if (cameraMatrixBuffer.current)
      entries.unshift({
        binding: 0,
        resource: { buffer: cameraMatrixBuffer.current },
      })

    return ctx.device.createBindGroup({
      layout: renderPipeline.current.getBindGroupLayout(0),
      entries,
    })
  })

  const depthStencil = useGPUResource(ctx, (ctx) => {
    if (!renderTarget.current) return

    return ctx.device.createTexture({
      size: {
        width: renderTarget.current.width,
        height: renderTarget.current.height,
      },
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    })
  })

  useGPUUpdate([renderTarget], ctx, (ctx) => {
    if (!vertexBuffer.current) return
    if (!vertexBufferLayout.current) return
    if (!renderTarget.current) return
    if (!depthStencil.current) return
    if (!renderPipeline.current) return
    if (!bindGroup.current) return
    const vertexCount =
      vertexBuffer.current.size / vertexBufferLayout.current.strideBytes

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
        view: depthStencil.current.createView(),
        depthClearValue: 1.0,
        depthLoadOp: "clear" as GPULoadOp,
        depthStoreOp: "store" as GPUStoreOp,
      },
    })
    passEncoder.setPipeline(renderPipeline.current)
    passEncoder.setVertexBuffer(0, vertexBuffer.current)
    passEncoder.setBindGroup(0, bindGroup.current)
    passEncoder.draw(vertexCount, 1, 0, 0)
    passEncoder.end()
  })

  return {
    cameraMatrixBuffer,
    textureSource,
    vertexBuffer,
    vertexBufferLayout,
    renderTarget,
  }
}
