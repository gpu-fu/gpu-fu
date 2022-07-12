/// <reference types="@webgpu/types" />
import Context from "./Context";
import TextureFilter from "./TextureFilter";
import TextureSource from "./TextureSource";
interface SetKernelOptions {
    bias?: number;
    scale?: number;
    normalize?: boolean;
}
export default class TextureFilterConvolve implements TextureFilter {
    private _textureSource?;
    private _kernelData?;
    private _kernelBuffer?;
    private _kernelBufferUpToDate;
    private _texture?;
    private _shaderModule?;
    private _computePipeline?;
    private _bindGroup?;
    private getKernelData;
    setKernel3x3(row0: [number, number, number], row1: [number, number, number], row2: [number, number, number], opts?: SetKernelOptions): void;
    getTextureSource(): TextureSource;
    setTextureSource(textureSource: TextureSource): void;
    private getKernelBuffer;
    private updateKernelBuffer;
    private getShaderModule;
    private getComputePipeline;
    private getBindGroup;
    textureSourceAsGPUTexture(ctx: Context): GPUTexture;
    textureSourceFrame(ctx: Context, frame: number): void;
}
export {};
