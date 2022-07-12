/// <reference types="@webgpu/types" />

import Context from "./Context"
import TextureFilter from "./TextureFilter"
import TextureSource from "./TextureSource"

import shaderModuleCode3x3 from "./TextureFilterConvolve3x3.wgsl"
import { autoLayout } from "./utils"

interface SetKernelOptions {
  bias?: number
  scale?: number
  normalize?: boolean
}

export default class TextureFilterConvolve implements TextureFilter {
  private _textureSource?: TextureSource
  private _kernelData?: Float32Array

  private _kernelBuffer?: GPUBuffer
  private _kernelBufferUpToDate = false
  private _texture?: GPUTexture
  private _shaderModule?: GPUShaderModule
  private _computePipeline?: GPUComputePipeline
  private _bindGroup?: GPUBindGroup

  private getKernelData(): Float32Array {
    if (this._kernelData) return this._kernelData
    throw new Error(`${this} has no _kernelData`)
  }

  setKernel3x3(
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

    // Create the kernel data array and fill it with data.
    const kernelData = new Float32Array(10)
    kernelData[0] = opts.bias ?? 0
    kernelData.set(row0, 1)
    kernelData.set(row1, 4)
    kernelData.set(row2, 7)

    // If the kernel size has changed, it invalidates almost everything.
    if (kernelData.byteLength !== this._kernelData?.byteLength) {
      this._kernelBuffer = undefined
      this._shaderModule = undefined
      this._computePipeline = undefined
      this._bindGroup = undefined
    }

    // Assign the kernel data array and mark the buffer data as invalidated.
    this._kernelData = kernelData
    this._kernelBufferUpToDate = false
  }

  getTextureSource(): TextureSource {
    if (this._textureSource) return this._textureSource
    throw new Error(`${this} has no _textureSource`)
  }

  setTextureSource(textureSource: TextureSource) {
    this._textureSource = textureSource
    this._bindGroup = undefined
  }

  private getKernelBuffer(ctx: Context): GPUBuffer {
    if (this._kernelBuffer) return this._kernelBuffer

    console.log("byteLength", this.getKernelData().byteLength)

    const buffer = ctx.device.createBuffer({
      size: this.getKernelData().byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    return (this._kernelBuffer = buffer)
  }

  private updateKernelBuffer(ctx: Context) {
    if (this._kernelBufferUpToDate) return

    const data = this.getKernelData()

    ctx.device.queue.writeBuffer(
      this.getKernelBuffer(ctx),
      0,
      data,
      0,
      data.length,
    )

    this._kernelBufferUpToDate = true
  }

  private getShaderModule(ctx: Context): GPUShaderModule {
    if (this._shaderModule) return this._shaderModule

    let shaderModuleCode: string
    switch (this.getKernelData().length) {
      case 10:
        shaderModuleCode = shaderModuleCode3x3
        break
      default:
        throw new Error("_kernelData length is invalid!")
    }

    return (this._shaderModule = ctx.device.createShaderModule({
      code: shaderModuleCode,
    }))
  }

  private getComputePipeline(ctx: Context): GPUComputePipeline {
    if (this._computePipeline) return this._computePipeline

    return (this._computePipeline = ctx.device.createComputePipeline({
      compute: {
        module: this.getShaderModule(ctx),
        entryPoint: "computeTextureFilterConvolve3x3",
      },
      layout: autoLayout(),
    }))
  }

  private getBindGroup(ctx: Context) {
    if (this._bindGroup) return this._bindGroup

    const sampler = ctx.device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
    })

    return (this._bindGroup = ctx.device.createBindGroup({
      layout: this.getComputePipeline(ctx).getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: { buffer: this.getKernelBuffer(ctx) },
        },
        {
          binding: 1,
          resource: this.getTextureSource()
            .textureSourceAsGPUTexture(ctx)
            .createView(),
        },
        {
          binding: 2,
          resource: this.textureSourceAsGPUTexture(ctx).createView(),
        },
      ],
    }))
  }

  textureSourceAsGPUTexture(ctx: Context): GPUTexture {
    if (this._texture) return this._texture

    const textureSource = this.getTextureSource().textureSourceAsGPUTexture(ctx)

    this._texture = ctx.device.createTexture({
      format: "rgba8unorm",
      size: {
        width: textureSource.width || 850, // TODO: remove fallback value
        height: textureSource.height || 1275, // TODO: remove fallback value
      },
      usage:
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.STORAGE_BINDING |
        GPUTextureUsage.TEXTURE_BINDING,
    })

    return this._texture
  }

  textureSourceFrame(ctx: Context, frame: number) {
    this.updateKernelBuffer(ctx)

    const textureSource = this.getTextureSource().textureSourceAsGPUTexture(ctx)
    const workGroupSizeX = 32 // (must match the WGSL code)
    const workGroupSizeY = 1 // (must match the WGSL code)

    const passEncoder = ctx.commandEncoder.beginComputePass()
    passEncoder.setPipeline(this.getComputePipeline(ctx))
    passEncoder.setBindGroup(0, this.getBindGroup(ctx))
    passEncoder.dispatch(
      (textureSource.width || 850) / workGroupSizeX, // TODO: remove fallback value
      (textureSource.height || 1275) / workGroupSizeY, // TODO: remove fallback value
    )
    passEncoder.end()
  }
}
