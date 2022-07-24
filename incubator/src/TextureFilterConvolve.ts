/// <reference types="@webgpu/types" />

import { Context, useGPUResource, useProp, useGPUUpdate } from "@gpu-fu/gpu-fu"

import shaderModuleCode3x3 from "./TextureFilterConvolve3x3.wgsl"

interface SetKernelOptions {
  bias?: number
  scale?: number
  normalize?: boolean
}

export default function TextureFilterConvolve(ctx: Context) {
  const textureSource = useProp<GPUTexture>(ctx)
  const kernelData = useProp<Float32Array>(ctx)

  function setKernel3x3(
    row0: [number, number, number],
    row1: [number, number, number],
    row2: [number, number, number],
    opts: SetKernelOptions = {},
  ) {
    // Respect scale and/or normalize options if present.
    if (opts.scale || opts.normalize) {
      var scale = opts.scale ?? 1
      if (opts.normalize) {
        var sum = 0
        sum = row0.reduce((accum, n) => accum + n, sum)
        sum = row1.reduce((accum, n) => accum + n, sum)
        sum = row2.reduce((accum, n) => accum + n, sum)
        if (sum !== 0) scale = scale / sum
      }
      if (scale !== 1) {
        row0 = row0.map((n) => n * scale) as typeof row0
        row1 = row1.map((n) => n * scale) as typeof row1
        row2 = row2.map((n) => n * scale) as typeof row2
      }
    }

    const newKernelData = new Float32Array(10)
    newKernelData[0] = opts.bias ?? 0
    newKernelData.set(row0, 1)
    newKernelData.set(row1, 4)
    newKernelData.set(row2, 7)
    kernelData.set(newKernelData)
  }

  const kernelBuffer = useGPUResource(
    ctx,
    (ctx) =>
      kernelData.current?.byteLength &&
      ctx.device.createBuffer({
        size: kernelData.current?.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      }),
  )

  useGPUUpdate([kernelBuffer], ctx, (ctx) => {
    if (!kernelBuffer.current) return
    if (!kernelData.current) return

    ctx.device.queue.writeBuffer(
      kernelBuffer.current,
      0,
      kernelData.current,
      0,
      kernelData.current.length,
    )
  })

  const computePipeline = useGPUResource(ctx, (ctx) => {
    let shaderModuleCode: string
    switch (kernelData.current?.length) {
      case 10:
        shaderModuleCode = shaderModuleCode3x3
        break
      default:
        return
    }

    return ctx.device.createComputePipeline({
      layout: "auto",
      compute: {
        module: ctx.device.createShaderModule({
          code: shaderModuleCode,
        }),
        entryPoint: "computeTextureFilterConvolve3x3",
      },
    })
  })

  const resultTexture = useGPUResource(ctx, (ctx) => {
    return ctx.device.createTexture({
      format: "rgba8unorm",
      size: {
        width: textureSource.current?.width || 850, // TODO: remove fallback value
        height: textureSource.current?.height || 1275, // TODO: remove fallback value
      },
      usage:
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.STORAGE_BINDING |
        GPUTextureUsage.TEXTURE_BINDING,
    })
  })

  const bindGroup = useGPUResource(
    ctx,
    (ctx) =>
      computePipeline.current &&
      kernelBuffer.current &&
      textureSource.current &&
      resultTexture.current &&
      ctx.device.createBindGroup({
        layout: computePipeline.current.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: kernelBuffer.current },
          },
          {
            binding: 1,
            resource: textureSource.current?.createView(),
          },
          {
            binding: 2,
            resource: resultTexture.current.createView(),
          },
        ],
      }),
  )

  useGPUUpdate([resultTexture], ctx, (ctx) => {
    if (!textureSource.current) return
    if (!computePipeline.current) return
    if (!bindGroup.current) return

    const workGroupSizeX = 32 // (must match the WGSL code)
    const workGroupSizeY = 1 // (must match the WGSL code)

    const passEncoder = ctx.commandEncoder.beginComputePass()
    passEncoder.setPipeline(computePipeline.current)
    passEncoder.setBindGroup(0, bindGroup.current)
    passEncoder.dispatchWorkgroups(
      (textureSource.current?.width || 850) / // TODO: remove fallback value
        workGroupSizeX,
      (textureSource.current?.height || 1275) / // TODO: remove fallback value
        workGroupSizeY,
    )
    passEncoder.end()
  })

  return {
    textureSource,
    setKernel3x3,
    resultTexture,
  }
}
