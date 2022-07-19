/// <reference types="@webgpu/types" />

import { UnitFn, createUnitRoot, Render } from "@gpu-fu/gpu-fu"
import { OutputCanvas } from "@gpu-fu/incubator"

type FrameFn = (commandEncoder: GPUCommandEncoder) => void
type SetupFn = (device: GPUDevice, canvasContext: GPUCanvasContext) => FrameFn

export default function runDemo(renderFn: UnitFn<Render>) {
  runDemoInner((device, canvasContext) => {
    const render = createUnitRoot(device, renderFn)

    const output = new OutputCanvas(canvasContext)
    output.addRender(render)

    return function frame(commandEncoder) {
      output.outputFrame(commandEncoder)
    }
  })
}

function runDemoInner(setupFn: SetupFn) {
  ;(async () => {
    const device = await getDevice()
    const canvasContext = await getCanvasContext(getDemoCanvas(), device)

    const frameFn = setupFn(device, canvasContext)

    function repeatFrameWithContext() {
      runFrameWithContext(device, frameFn)
      requestAnimationFrame(repeatFrameWithContext)
    }
    requestAnimationFrame(repeatFrameWithContext)
  })().catch((error) => {
    document.querySelector("body")!.innerHTML = error
    console.error(error)
  })
}

async function getDevice(
  powerPreference: GPUPowerPreference = "high-performance",
): Promise<GPUDevice> {
  if (!navigator.gpu)
    throw new Error("Your browser doesn't have WebGPU enabled!")

  const gpu = await navigator.gpu.requestAdapter({ powerPreference })
  if (!gpu) throw new Error("Failed to get the GPU adapter!")

  return gpu.requestDevice()
}

export function getDemoCanvas(): HTMLCanvasElement {
  const canvas = document.querySelector(
    "canvas.main",
  ) as HTMLCanvasElement | null
  if (!canvas) throw new Error("The main canvas wasn't found in the HTML!")

  return canvas
}

async function getCanvasContext(
  canvas: HTMLCanvasElement,
  device: GPUDevice,
): Promise<GPUCanvasContext> {
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

function runFrameWithContext(device: GPUDevice, frameFn: FrameFn) {
  const commandEncoder = device.createCommandEncoder()
  frameFn(commandEncoder)
  device.queue.submit([commandEncoder.finish()])
}
