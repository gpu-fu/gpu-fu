/// <reference types="@webgpu/types" />
import Context from "./Context";
export default interface TextureSource {
    textureSourceAsGPUTexture(ctx: Context): GPUTexture;
    textureSourceFrame(ctx: Context, frame: number): void;
}
