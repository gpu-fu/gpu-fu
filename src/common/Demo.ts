/// <reference types="@webgpu/types" />

export interface DemoProps {
  device: GPUDevice
  canvasContext: GPUCanvasContext
}

export default abstract class Demo {
  device: GPUDevice
  canvasContext: GPUCanvasContext

  constructor(props: DemoProps) {
    this.device = props.device
    this.canvasContext = props.canvasContext
  }

  abstract setup(): unknown
  abstract frame(): unknown

  run() {
    this.setup()

    requestAnimationFrame(this.runFrameRepeatedly.bind(this))
  }

  private runFrameRepeatedly() {
    this.frame()

    requestAnimationFrame(this.runFrameRepeatedly.bind(this))
  }

  runCommand(fn: (commandEncoder: GPUCommandEncoder) => unknown) {
    const commandEncoder = this.device.createCommandEncoder()
    fn(commandEncoder)
    this.device.queue.submit([commandEncoder.finish()])
  }

  // Some browsers don't yet support the `layout: "auto"`, so for them
  // we introduce this hack that pretends that `undefined` is that string
  // at the TypeScript level, so that the browser can fill it in as the default,
  // despite the types no longer allowing for it to be undefined.
  //
  // Eventually this hack will stop working and we'll just replace this
  // with actually returning the string "auto" and it will be better.
  autoLayout() {
    return undefined as unknown as GPUAutoLayoutMode
  }
}

export function runDemo<T extends Demo>(type: { new (props: DemoProps): T }) {
  ;(async () => {
    const device = await getDevice()
    const canvasContext = await getCanvasContext("canvas.main", device)

    const demo = new type({ device, canvasContext })
    demo.run()
  })().catch((error) => {
    document.querySelector("body")!.innerHTML = error
    console.error(error)
  })
}

async function getDevice(
  powerPreference: GPUPowerPreference = "high-performance"
): Promise<GPUDevice> {
  if (!navigator.gpu)
    throw new Error("Your browser doesn't have WebGPU enabled!")

  const gpu = await navigator.gpu.requestAdapter({ powerPreference })
  if (!gpu) throw new Error("Failed to get the GPU adapter!")

  return gpu.requestDevice()
}

async function getCanvasContext(
  querySelector: string,
  device: GPUDevice
): Promise<GPUCanvasContext> {
  const canvas = document.querySelector(
    querySelector
  ) as HTMLCanvasElement | null
  if (!canvas) throw new Error("The main canvas wasn't found in the HTML!")

  const canvasContext = canvas.getContext("webgpu") as GPUCanvasContext | null
  if (!canvasContext) throw new Error("Failed to get a WebGPU canvas context!")

  canvasContext.configure({
    device,
    format: getPreferredCanvasFormat(),
    alphaMode: "opaque",
  })

  return canvasContext
}

function getPreferredCanvasFormat() {
  // Some browsers throw an "Illegal invocation" error if we don't bind.
  const getPreferredCanvasFormat =
    navigator.gpu?.getPreferredCanvasFormat?.bind(navigator.gpu)
  if (getPreferredCanvasFormat) return getPreferredCanvasFormat()

  // Hard-coded default for browsers that don't implement this function yet.
  return "rgba8unorm"
}
