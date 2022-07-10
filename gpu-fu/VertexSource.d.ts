/// <reference types="@webgpu/types" />
import Context from "./Context";
export default interface VertexSource {
    vertexSourceAsGPUBuffer(ctx: Context): GPUBuffer;
    vertexSourceTotalBytes(ctx: Context): number;
    vertexSourceStrideBytes(ctx: Context): number;
    vertexSourceXYZWOffsetBytes(ctx: Context): number;
    vertexSourceUVOffsetBytes(ctx: Context): number;
    vertexSourceFrame(ctx: Context, frame: number): number;
}
