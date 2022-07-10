/// <reference types="@webgpu/types" />

import Context from "./Context"
import VertexSource from "./VertexSource"

export default class VertexSourceRect implements VertexSource {
  private _aspectFillRatio?: number

  private _buffer?: GPUBuffer
  private _bufferUpToDate = false

  setAspectFillRatio(ratio: number) {
    if (this._aspectFillRatio === ratio) return
    this._aspectFillRatio = ratio
    this._bufferUpToDate = false
  }

  private getBuffer(ctx: Context): GPUBuffer {
    if (this._buffer) return this._buffer

    const buffer = ctx.device.createBuffer({
      size: this.vertexSourceTotalBytes(ctx),
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    })

    return (this._buffer = buffer)
  }

  private updateBuffer(ctx: Context) {
    if (this._bufferUpToDate) return

    var uMin = 0
    var uMax = 1
    var vMin = 0
    var vMax = 1

    if (this._aspectFillRatio) {
      if (this._aspectFillRatio < 1) {
        vMin = 0.5 - 0.5 * this._aspectFillRatio
        vMax = 1 - vMin
      } else {
        uMin = 0.5 - 0.5 / this._aspectFillRatio
        uMax = 1 - uMin
      }
    }

    // prettier-ignore
    const data = new Float32Array([
    // (x, y, z, w),  (u, v)
        1, 1, 0, 1, uMax, vMin,
       -1,-1, 0, 1, uMin, vMax,
       -1, 1, 0, 1, uMin, vMin,
        1, 1, 0, 1, uMax, vMin,
        1,-1, 0, 1, uMax, vMax,
       -1,-1, 0, 1, uMin, vMax,
    ])

    ctx.device.queue.writeBuffer(this.getBuffer(ctx), 0, data, 0, data.length)

    this._bufferUpToDate = true
  }

  vertexSourceAsGPUBuffer(ctx: Context): GPUBuffer {
    return this.getBuffer(ctx)
  }

  vertexSourceTotalBytes = (ctx: Context) => 6 * 6 * 4
  vertexSourceStrideBytes = (ctx: Context) => 6 * 4
  vertexSourceXYZWOffsetBytes = (ctx: Context) => 0
  vertexSourceUVOffsetBytes = (ctx: Context) => 4 * 4

  vertexSourceFrame(ctx: Context, frame: number) {
    this.updateBuffer(ctx)
    return 6
  }
}
