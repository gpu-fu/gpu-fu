/// <reference types="@webgpu/types" />

import {
  Context,
  Render,
  VertexSource,
  TextureSource,
  autoLayout,
} from "@gpu-fu/gpu-fu"

import shaderModuleCode from "./RenderUV.wgsl"

export default class RenderUV implements Render {
  private _vertexSource?: VertexSource
  private _textureSource?: TextureSource

  private _shaderModule?: GPUShaderModule
  private _renderPipeline?: GPURenderPipeline
  private _bindGroup?: GPUBindGroup

  getVertexSource(): VertexSource {
    if (this._vertexSource) return this._vertexSource
    throw new Error(`${this} has no _vertexSource`)
  }

  setVertexSource(vertexSource: VertexSource) {
    this._vertexSource = vertexSource
    this._renderPipeline = undefined
    this._bindGroup = undefined
  }

  getTextureSource(): TextureSource {
    if (this._textureSource) return this._textureSource
    throw new Error(`${this} has no _textureSource`)
  }

  setTextureSource(textureSource: TextureSource) {
    this._textureSource = textureSource
    this._renderPipeline = undefined
    this._bindGroup = undefined
  }

  getShaderModule(ctx: Context): GPUShaderModule {
    if (this._shaderModule) return this._shaderModule

    return (this._shaderModule = ctx.device.createShaderModule({
      code: shaderModuleCode,
    }))
  }

  getRenderPipeline(ctx: Context): GPURenderPipeline {
    if (this._renderPipeline) return this._renderPipeline

    const vertexSource = this.getVertexSource()

    return (this._renderPipeline = ctx.device.createRenderPipeline({
      vertex: {
        module: this.getShaderModule(ctx),
        entryPoint: "vertexRenderUV",
        buffers: [
          {
            arrayStride: vertexSource.vertexSourceStrideBytes(ctx),
            attributes: [
              {
                shaderLocation: 0,
                offset: vertexSource.vertexSourceXYZWOffsetBytes(ctx),
                format: "float32x4" as GPUVertexFormat,
              },
              {
                shaderLocation: 1,
                offset: vertexSource.vertexSourceUVOffsetBytes(ctx),
                format: "float32x2" as GPUVertexFormat,
              },
            ],
          },
        ],
      },
      fragment: {
        module: this.getShaderModule(ctx),
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
      },
      layout: autoLayout(),
    }))
  }

  getBindGroup(ctx: Context) {
    if (this._bindGroup) return this._bindGroup

    const sampler = ctx.device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
    })

    return (this._bindGroup = ctx.device.createBindGroup({
      layout: this.getRenderPipeline(ctx).getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: sampler,
        },
        {
          binding: 1,
          resource: this.getTextureSource()
            .textureSourceAsGPUTexture(ctx)
            .createView(),
        },
      ],
    }))
  }

  renderFrame(ctx: Context, frame: number, target: GPUTexture): void {
    this.getTextureSource().textureSourceFrame(ctx, frame)
    const vertexCount = this.getVertexSource().vertexSourceFrame(ctx, frame)

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
    passEncoder.setVertexBuffer(
      0,
      this.getVertexSource().vertexSourceAsGPUBuffer(ctx),
    )
    passEncoder.setBindGroup(0, this.getBindGroup(ctx))
    passEncoder.draw(vertexCount, 1, 0, 0)
    passEncoder.end()
  }
}
