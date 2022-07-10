/// <reference types="@webgpu/types" />
import Context from "./Context";
import Render from "./Render";
export default class OutputCanvas {
    _canvasContext: GPUCanvasContext;
    _renders: Render[];
    constructor(canvasContext: GPUCanvasContext);
    addRender(render: Render): void;
    outputFrame(ctx: Context, frame: number): void;
}
