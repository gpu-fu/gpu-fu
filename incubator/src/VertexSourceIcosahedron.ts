/// <reference types="@webgpu/types" />

import { Context, useGPUResource, useGPUAction } from "@gpu-fu/gpu-fu"

const vertexSourceCount = 60
const vertexSourceXYZWOffsetBytes = 0
const vertexSourceUVOffsetBytes = 4 * 4
const vertexSourceStrideBytes = 6 * 4
const vertexSourceTotalBytes = vertexSourceCount * vertexSourceStrideBytes

export default function VertexSourceIcosahedron(ctx: Context) {
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

      const t = (1 + Math.sqrt(5)) / 2

      // prettier-ignore
      const data = new Float32Array([
      // (x, y, z, w),  (u, v)
          t, 1, 0, 1, uMax, vMin, // v0
          0, t, 1, 1, uMax, vMax, // v8
          1, 0, t, 1, uMin, vMax, // v4

          t, 1, 0, 1, uMax, vMin, // v0
          1, 0, t, 1, uMax, vMax, // v4
          t,-1, 0, 1, uMin, vMax, // v2

          t, 1, 0, 1, uMax, vMin, // v0
          t,-1, 0, 1, uMax, vMax, // v2
          1, 0,-t, 1, uMin, vMax, // v5

          t, 1, 0, 1, uMax, vMin, // v0
          1, 0,-t, 1, uMax, vMax, // v5
          0, t,-1, 1, uMin, vMax, // v10

          t, 1, 0, 1, uMax, vMin, // v0
          0, t,-1, 1, uMax, vMax, // v10
          0, t, 1, 1, uMin, vMax, // v8

         -1, 0, t, 1, uMax, vMin, // v1
          1, 0, t, 1, uMax, vMax, // v4
          0, t, 1, 1, uMin, vMax, // v8

          0,-t, 1, 1, uMax, vMin, // v6
          t,-1, 0, 1, uMax, vMax, // v2
          1, 0, t, 1, uMin, vMax, // v4

          0,-t,-1, 1, uMax, vMin, // v9
          1, 0,-t, 1, uMax, vMax, // v5
          t,-1, 0, 1, uMin, vMax, // v2

         -1, 0,-t, 1, uMax, vMin, // v11
          0, t,-1, 1, uMax, vMax, // v10
          1, 0,-t, 1, uMin, vMax, // v5

         -t, 1, 0, 1, uMax, vMin, // v7
          0, t, 1, 1, uMax, vMax, // v8
          0, t,-1, 1, uMin, vMax, // v10

          1, 0, t, 1, uMax, vMin, // v4
         -1, 0, t, 1, uMax, vMax, // v1
          0,-t, 1, 1, uMin, vMax, // v6

          t,-1, 0, 1, uMax, vMin, // v2
          0,-t, 1, 1, uMax, vMax, // v6
          0,-t,-1, 1, uMin, vMax, // v9

          1, 0,-t, 1, uMax, vMin, // v5
          0,-t,-1, 1, uMax, vMax, // v9
         -1, 0,-t, 1, uMin, vMax, // v11

          0, t,-1, 1, uMax, vMin, // v10
         -1, 0,-t, 1, uMax, vMax, // v11
         -t, 1, 0, 1, uMin, vMax, // v7

          0, t, 1, 1, uMax, vMin, // v8
         -t, 1, 0, 1, uMax, vMax, // v7
         -1, 0, t, 1, uMin, vMax, // v1

         -t,-1, 0, 1, uMax, vMin, // v3
          0,-t, 1, 1, uMax, vMax, // v6
         -1, 0, t, 1, uMin, vMax, // v1

         -t,-1, 0, 1, uMax, vMin, // v3
          0,-t,-1, 1, uMax, vMax, // v9
          0,-t, 1, 1, uMin, vMax, // v6

         -t,-1, 0, 1, uMax, vMin, // v3
         -1, 0,-t, 1, uMax, vMax, // v11
          0,-t,-1, 1, uMin, vMax, // v9

         -t,-1, 0, 1, uMax, vMin, // v3
         -t, 1, 0, 1, uMax, vMax, // v7
         -1, 0,-t, 1, uMin, vMax, // v11

         -t,-1, 0, 1, uMax, vMin, // v3
         -1, 0, t, 1, uMax, vMax, // v1
         -t, 1, 0, 1, uMin, vMax, // v7
      ])

      ctx.device.queue.writeBuffer(buffer, 0, data, 0, data.length)
    },
    [buffer],
  )

  return {
    vertexSourceCount,
    vertexSourceTotalBytes,
    vertexSourceStrideBytes,
    vertexSourceXYZWOffsetBytes,
    vertexSourceUVOffsetBytes,
    vertexSourceAsGPUBuffer: buffer,
  }
}
