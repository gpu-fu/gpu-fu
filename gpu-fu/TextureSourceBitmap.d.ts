/// <reference types="@webgpu/types" />
import Context from "./Context";
import TextureSource from "./TextureSource";
export default class TextureSourceBitmap implements TextureSource {
    private _imageBitmap;
    private _label;
    private _texture?;
    constructor(imageBitmap: ImageBitmap, label: string);
    static fromURL(url: string, label?: string): Promise<TextureSourceBitmap>;
    textureSourceAsGPUTexture(ctx: Context): GPUTexture;
    textureSourceFrame(ctx: Context, frame: number): void;
}
