/// <reference types="@webgpu/types" />

import { Context } from "@gpu-fu/gpu-fu"

type FrameFn = (ctx: Context, frame: number) => void
type SetupFn = (
  device: GPUDevice,
  canvasContext: GPUCanvasContext,
) => Promise<FrameFn>

export default function runDemo(setupFn: SetupFn) {
  ;(async () => {
    const device = await getDevice()
    const canvasContext = await getCanvasContext("canvas.main", device)

    const frameFn = await setupFn(device, canvasContext)

    var frame = 0
    function repeatFrameWithContext() {
      frame = frame + 1
      runFrameWithContext(device, frame, frameFn)
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

async function getCanvasContext(
  querySelector: string,
  device: GPUDevice,
): Promise<GPUCanvasContext> {
  const canvas = document.querySelector(
    querySelector,
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

function runFrameWithContext(
  device: GPUDevice,
  frame: number,
  frameFn: FrameFn,
) {
  const commandEncoder = device.createCommandEncoder()
  frameFn({ device, commandEncoder }, frame)
  device.queue.submit([commandEncoder.finish()])
}
