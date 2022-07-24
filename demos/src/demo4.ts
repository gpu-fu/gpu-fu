/// <reference types="@webgpu/types" />

import { useUnit } from "@gpu-fu/gpu-fu"
import {
  MatrixSourceOrbitalCameraWithControls,
  RenderUV,
  TextureSourceBitmapFromURL,
  VertexSourceIcosahedron,
} from "@gpu-fu/incubator"

import runDemo, { getDemoCanvas } from "./runDemo"
runDemo((ctx) => {
  const camera = useUnit(ctx, MatrixSourceOrbitalCameraWithControls)
  const icosahedron = useUnit(ctx, VertexSourceIcosahedron)
  const textureSource = useUnit(ctx, TextureSourceBitmapFromURL)
  textureSource.url.set("./assets/fireweed.jpg")

  camera.canvas.set(getDemoCanvas())

  const { renderTarget, ...render } = useUnit(ctx, RenderUV)
  render.cameraMatrixBuffer.setFrom(camera.resultMatrixBuffer)
  render.textureSource.setFrom(textureSource.resultTexture)
  render.vertexBuffer.setFrom(icosahedron.resultVertexBuffer)
  render.vertexBufferLayout.set(icosahedron.resultVertexBufferLayout)

  return { renderTarget }
})
