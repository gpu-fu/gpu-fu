/// <reference types="@webgpu/types" />
export interface DemoProps {
    device: GPUDevice;
    canvasContext: GPUCanvasContext;
}
export default abstract class Demo {
    device: GPUDevice;
    canvasContext: GPUCanvasContext;
    constructor(props: DemoProps);
    abstract setup(): unknown;
    abstract frame(): unknown;
    run(): void;
    private runFrameRepeatedly;
    runCommand(fn: (commandEncoder: GPUCommandEncoder) => unknown): void;
}
export declare function runDemo<T extends Demo>(type: {
    new (props: DemoProps): T;
}): void;
