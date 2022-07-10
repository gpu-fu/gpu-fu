/// <reference types="@webgpu/types" />
import Context from "./Context";
export default interface Render {
    renderFrame(ctx: Context, frame: number, target: GPUTexture): void;
}
