/// <reference types="@webgpu/types" />

import { PropertyReadOnly } from "./Property"

export default interface VertexSource {
  vertexSourceAsGPUBuffer: PropertyReadOnly<GPUBuffer>
  vertexSourceCount: number
  vertexSourceTotalBytes: number
  vertexSourceStrideBytes: number
  vertexSourceXYZWOffsetBytes: number
  vertexSourceUVOffsetBytes: number
}
