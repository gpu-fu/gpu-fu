/// <reference types="@webgpu/types" />

import Demo, { runDemo } from "../common/Demo"

import SimpleTriangle from "./shaders/vertex/SimpleTriangle.wgsl"
import ColorByPosition from "./shaders/fragment/ColorByPosition.wgsl"

runDemo(
  class Demo1 extends Demo {
    renderPipeline: GPURenderPipeline | undefined

    setup() {
      this.renderPipeline = this.device.createRenderPipeline({
        vertex: {
          module: this.device.createShaderModule({ code: SimpleTriangle }),
          entryPoint: "main",
        },
        fragment: {
          module: this.device.createShaderModule({ code: ColorByPosition }),
          entryPoint: "main",
          targets: [
            {
              format:
                this.canvasContext.getCurrentTexture().format || "rgba8unorm",
            },
          ],
        },
        primitive: {
          topology: "triangle-list",
        },
        layout: this.autoLayout(),
      })
    }

    frame() {
      this.runCommand((commandEncoder) => {
        const passEncoder = commandEncoder.beginRenderPass({
          colorAttachments: [
            {
              view: this.canvasContext.getCurrentTexture().createView(),
              clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
              loadOp: "clear" as GPULoadOp,
              storeOp: "store" as GPUStoreOp,
            },
          ],
        })
        passEncoder.setPipeline(this.renderPipeline!)
        passEncoder.draw(3, 1, 0, 0)
        passEncoder.end()
      })
    }
  }
)
