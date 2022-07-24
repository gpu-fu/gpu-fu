/// <reference types="@webgpu/types" />

import { Context, useProp, useGPUUpdate, useGPUResource } from "@gpu-fu/gpu-fu"

const vertexSourceCount = 6
const vertexSourceTotalBytes = 6 * 6 * 4
const vertexSourceStrideBytes = 6 * 4
const vertexSourceXYZWOffsetBytes = 0
const vertexSourceUVOffsetBytes = 4 * 4

export default function VertexSourceRect(ctx: Context) {
  const aspectFillRatio = useProp<number>(ctx)

  const buffer = useGPUResource(ctx, (ctx) =>
    ctx.device.createBuffer({
      size: vertexSourceTotalBytes,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    }),
  )

  useGPUUpdate([buffer], ctx, (ctx) => {
    if (!buffer.current) return

    var uMin = 0
    var uMax = 1
    var vMin = 0
    var vMax = 1

    if (aspectFillRatio.current) {
      if (aspectFillRatio.current < 1) {
        vMin = 0.5 - 0.5 * aspectFillRatio.current
        vMax = 1 - vMin
      } else {
        uMin = 0.5 - 0.5 / aspectFillRatio.current
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

    ctx.device.queue.writeBuffer(buffer.current, 0, data, 0, data.length)
  })

  return {
    aspectFillRatio,
    vertexSourceCount,
    vertexSourceTotalBytes,
    vertexSourceStrideBytes,
    vertexSourceXYZWOffsetBytes,
    vertexSourceUVOffsetBytes,
    vertexSourceAsGPUBuffer: buffer,
  }
}
