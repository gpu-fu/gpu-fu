/// <reference types="@webgpu/types" />

import {
  TextureSource,
  autoLayout,
  Context,
  useGPUResource,
  useGPUAction,
  useProp,
  useUnitProp,
} from "@gpu-fu/gpu-fu"

import shaderModuleCode3x3 from "./TextureFilterConvolve3x3.wgsl"

interface SetKernelOptions {
  bias?: number
  scale?: number
  normalize?: boolean
}

export default function TextureFilterConvolve(ctx: Context) {
  const textureSource = useUnitProp<TextureSource>(ctx)
  const kernelData = useProp<Float32Array>(ctx)

  const textureSourceAsGPUTexture = textureSource()?.textureSourceAsGPUTexture
  const kernelDataByteLength = kernelData()?.byteLength

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
      kernelDataByteLength &&
      ctx.device.createBuffer({
        size: kernelDataByteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      }),
    [kernelDataByteLength],
  )

  useGPUAction(
    ctx,
    (ctx) => {
      const currentKernelData = kernelData()
      if (!kernelBuffer) return
      if (!currentKernelData) return

      ctx.device.queue.writeBuffer(
        kernelBuffer,
        0,
        currentKernelData,
        0,
        currentKernelData.length,
      )
    },
    [kernelBuffer, kernelData()],
  )

  const computePipeline = useGPUResource(
    ctx,
    (ctx) => {
      let shaderModuleCode: string
      switch (kernelData()?.length) {
        case 10:
          shaderModuleCode = shaderModuleCode3x3
          break
        default:
          return
      }

      return ctx.device.createComputePipeline({
        compute: {
          module: ctx.device.createShaderModule({
            code: shaderModuleCode,
          }),
          entryPoint: "computeTextureFilterConvolve3x3",
        },
        layout: autoLayout(),
      })
    },
    [kernelData()?.length],
  )

  const texture = useGPUResource(
    ctx,
    (ctx) =>
      ctx.device.createTexture({
        format: "rgba8unorm",
        size: {
          width: textureSourceAsGPUTexture?.width || 850, // TODO: remove fallback value
          height: textureSourceAsGPUTexture?.height || 1275, // TODO: remove fallback value
        },
        usage:
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.STORAGE_BINDING |
          GPUTextureUsage.TEXTURE_BINDING,
      }),
    [textureSourceAsGPUTexture],
  )

  const bindGroup = useGPUResource(
    ctx,
    (ctx) =>
      computePipeline &&
      kernelBuffer &&
      textureSourceAsGPUTexture &&
      texture &&
      ctx.device.createBindGroup({
        layout: computePipeline.getBindGroupLayout(0),
        entries: [
          {
            binding: 0,
            resource: { buffer: kernelBuffer },
          },
          {
            binding: 1,
            resource: textureSourceAsGPUTexture.createView(),
          },
          {
            binding: 2,
            resource: texture.createView(),
          },
        ],
      }),
    [computePipeline, kernelBuffer, textureSourceAsGPUTexture, texture],
  )

  useGPUAction(
    ctx,
    (ctx) => {
      if (!textureSourceAsGPUTexture) return
      if (!computePipeline) return
      if (!bindGroup) return

      const workGroupSizeX = 32 // (must match the WGSL code)
      const workGroupSizeY = 1 // (must match the WGSL code)

      const passEncoder = ctx.commandEncoder.beginComputePass()
      passEncoder.setPipeline(computePipeline)
      passEncoder.setBindGroup(0, bindGroup)
      passEncoder.dispatch(
        (textureSourceAsGPUTexture.width || 850) / // TODO: remove fallback value
          workGroupSizeX,
        (textureSourceAsGPUTexture.height || 1275) / // TODO: remove fallback value
          workGroupSizeY,
      )
      passEncoder.end()
    },
    [textureSourceAsGPUTexture, computePipeline, bindGroup],
  )

  return {
    textureSource,
    setKernel3x3,
    textureSourceAsGPUTexture: texture,
  }
}
