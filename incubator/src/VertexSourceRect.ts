/// <reference types="@webgpu/types" />

import {
  Context,
  useProp,
  useGPUUpdate,
  useGPUResource,
  VertexBufferLayout,
} from "@gpu-fu/gpu-fu"

const resultVertexCount = 6
const resultVertexBufferLayout: VertexBufferLayout = {
  xyzwOffsetBytes: 0,
  uvOffsetBytes: 4 * Float32Array.BYTES_PER_ELEMENT,
  strideBytes: 6 * Float32Array.BYTES_PER_ELEMENT,
}

export default function VertexSourceRect(ctx: Context) {
  const aspectFillRatio = useProp<number>(ctx)

  const resultVertexBuffer = useGPUResource(ctx, (ctx) =>
    ctx.device.createBuffer({
      size: resultVertexCount * resultVertexBufferLayout.strideBytes,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    }),
  )

  useGPUUpdate([resultVertexBuffer], ctx, (ctx) => {
    if (!resultVertexBuffer.current) return

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

    ctx.device.queue.writeBuffer(
      resultVertexBuffer.current,
      0,
      data,
      0,
      data.length,
    )
  })

  return {
    aspectFillRatio,
    resultVertexBuffer,
    resultVertexBufferLayout,
  }
}
