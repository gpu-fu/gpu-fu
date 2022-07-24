/// <reference types="@webgpu/types" />

export default interface VertexBufferLayout {
  strideBytes: number
  xyzwOffsetBytes: number
  uvOffsetBytes: number
}
