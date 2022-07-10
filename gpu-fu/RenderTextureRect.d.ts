/// <reference types="@webgpu/types" />
import Context from "./Context";
import Render from "./Render";
import TextureSource from "./TextureSource";
export default class RenderTextureRect implements Render {
    private _renderUV;
    constructor();
    setTextureSource(textureSource: TextureSource): void;
    renderFrame(ctx: Context, frame: number, target: GPUTexture): void;
}
