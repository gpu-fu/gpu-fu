/// <reference types="@webgpu/types" />

import {
  Context,
  Unit,
  MatrixSource,
  VertexSource,
  TextureSource,
  autoLayout,
  useProp,
  useGPUResource,
  useGPUUpdate,
} from "@gpu-fu/gpu-fu"

import shaderModuleCode from "./RenderUV.wgsl"

export default function RenderUV(ctx: Context) {
  const cameraSource = useProp<Unit<MatrixSource>>(ctx)
  const vertexSource = useProp<Unit<VertexSource>>(ctx)
  const textureSource = useProp<Unit<TextureSource>>(ctx)
  const renderTarget = useProp<GPUTexture>(ctx)

  const shaderModule = useGPUResource(ctx, (ctx) =>
    ctx.device.createShaderModule({
      code: shaderModuleCode,
    }),
  )

  const renderPipeline = useGPUResource(ctx, (ctx) => {
    if (!vertexSource.current) return

    return ctx.device.createRenderPipeline({
      vertex: {
        module: shaderModule.current,
        entryPoint: cameraSource.current?.cameraSourceAsGPUBuffer
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
        module: shaderModule.current,
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
  })

  const sampler = useGPUResource(ctx, (ctx) =>
    ctx.device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
    }),
  )

  const bindGroup = useGPUResource(ctx, (ctx) => {
    if (!renderPipeline.current) return
    if (!textureSource.current?.textureSourceAsGPUTexture.current) return

    const entries: GPUBindGroupEntry[] = [
      {
        binding: 1,
        resource: sampler.current,
      },
      {
        binding: 2,
        resource:
          textureSource.current?.textureSourceAsGPUTexture.current.createView(),
      },
    ]
    if (cameraSource.current?.cameraSourceAsGPUBuffer)
      entries.unshift({
        binding: 0,
        resource: {
          buffer: cameraSource.current?.cameraSourceAsGPUBuffer.current,
        },
      })

    return ctx.device.createBindGroup({
      layout: renderPipeline.current.getBindGroupLayout(0),
      entries,
    })
  })

  const depthTexture = useGPUResource(ctx, (ctx) =>
    ctx.device.createTexture({
      size: [300, 300], // TODO: somehow get from canvas client size
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    }),
  )

  useGPUUpdate([renderTarget], ctx, (ctx) => {
    // TODO: Remove the need for the following lines here:
    cameraSource.current?.cameraSourceAsGPUBuffer.current
    textureSource.current?.textureSourceAsGPUTexture.current

    if (!vertexSource.current) return
    if (!renderTarget.current) return
    if (!renderPipeline.current) return
    if (!bindGroup.current) return

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
        view: depthTexture.current.createView(),
        depthClearValue: 1.0,
        depthLoadOp: "clear" as GPULoadOp,
        depthStoreOp: "store" as GPUStoreOp,
      },
    })
    passEncoder.setPipeline(renderPipeline.current)
    passEncoder.setVertexBuffer(
      0,
      vertexSource.current.vertexSourceAsGPUBuffer.current,
    )
    passEncoder.setBindGroup(0, bindGroup.current)
    passEncoder.draw(vertexSource.current.vertexSourceCount, 1, 0, 0)
    passEncoder.end()
  })

  return {
    cameraSource,
    textureSource,
    vertexSource,
    renderTarget,
  }
}
