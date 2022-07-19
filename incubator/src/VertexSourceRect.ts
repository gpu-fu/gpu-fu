/// <reference types="@webgpu/types" />

import { Context, useProp, useGPUAction, useGPUResource } from "@gpu-fu/gpu-fu"

const vertexSourceCount = 6
const vertexSourceTotalBytes = 6 * 6 * 4
const vertexSourceStrideBytes = 6 * 4
const vertexSourceXYZWOffsetBytes = 0
const vertexSourceUVOffsetBytes = 4 * 4

export default function VertexSourceRect(ctx: Context) {
  const [aspectFillRatio, setAspectFillRatio] = useProp<number>(ctx)

  const buffer = useGPUResource(
    ctx,
    (ctx) =>
      ctx.device.createBuffer({
        size: vertexSourceTotalBytes,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      }),
    [],
  )

  useGPUAction(
    ctx,
    (ctx) => {
      if (!buffer) return

      var uMin = 0
      var uMax = 1
      var vMin = 0
      var vMax = 1

      if (aspectFillRatio) {
        if (aspectFillRatio < 1) {
          vMin = 0.5 - 0.5 * aspectFillRatio
          vMax = 1 - vMin
        } else {
          uMin = 0.5 - 0.5 / aspectFillRatio
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

      ctx.device.queue.writeBuffer(buffer, 0, data, 0, data.length)
    },
    [buffer, aspectFillRatio],
  )

  return {
    setAspectFillRatio,
    vertexSourceCount,
    vertexSourceTotalBytes,
    vertexSourceStrideBytes,
    vertexSourceXYZWOffsetBytes,
    vertexSourceUVOffsetBytes,
    vertexSourceAsGPUBuffer: buffer,
  }
}
