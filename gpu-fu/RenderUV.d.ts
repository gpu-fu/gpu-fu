/// <reference types="@webgpu/types" />
import Context from "./Context";
import Render from "./Render";
import VertexSource from "./VertexSource";
import TextureSource from "./TextureSource";
export default class RenderUV implements Render {
    private _vertexSource?;
    private _textureSource?;
    private _shaderModule?;
    private _renderPipeline?;
    private _bindGroup?;
    getVertexSource(): VertexSource;
    setVertexSource(vertexSource: VertexSource): void;
    getTextureSource(): TextureSource;
    setTextureSource(textureSource: TextureSource): void;
    getShaderModule(ctx: Context): GPUShaderModule;
    getRenderPipeline(ctx: Context): GPURenderPipeline;
    getBindGroup(ctx: Context): GPUBindGroup;
    renderFrame(ctx: Context, frame: number, target: GPUTexture): void;
}
