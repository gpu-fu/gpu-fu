/// <reference types="@webgpu/types" />
import Context from "../gpu-fu/Context";
declare type FrameFn = (ctx: Context, frame: number) => void;
declare type SetupFn = (device: GPUDevice, canvasContext: GPUCanvasContext) => Promise<FrameFn>;
export default function runDemo(setupFn: SetupFn): void;
export {};
