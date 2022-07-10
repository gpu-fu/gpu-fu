/// <reference types="@webgpu/types" />
import Context from "./Context";
import VertexSource from "./VertexSource";
export default class VertexSourceRect implements VertexSource {
    private _aspectFillRatio?;
    private _buffer?;
    private _bufferUpToDate;
    setAspectFillRatio(ratio: number): void;
    private getBuffer;
    private updateBuffer;
    vertexSourceAsGPUBuffer(ctx: Context): GPUBuffer;
    vertexSourceTotalBytes: (ctx: Context) => number;
    vertexSourceStrideBytes: (ctx: Context) => number;
    vertexSourceXYZWOffsetBytes: (ctx: Context) => number;
    vertexSourceUVOffsetBytes: (ctx: Context) => number;
    vertexSourceFrame(ctx: Context, frame: number): number;
}
