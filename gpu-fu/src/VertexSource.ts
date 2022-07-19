/// <reference types="@webgpu/types" />

export default interface VertexSource {
  vertexSourceAsGPUBuffer: GPUBuffer
  vertexSourceCount: number
  vertexSourceTotalBytes: number
  vertexSourceStrideBytes: number
  vertexSourceXYZWOffsetBytes: number
  vertexSourceUVOffsetBytes: number
}
