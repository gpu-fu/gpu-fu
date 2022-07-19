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
  const cameraSource = useUnit(ctx, MatrixSourceOrbitalCameraWithControls)
  const vertexSource = useUnit(ctx, VertexSourceIcosahedron)
  const textureSource = useUnit(ctx, TextureSourceBitmapFromURL)
  textureSource.url.set("./assets/fireweed.jpg")

  cameraSource.setCanvas(getDemoCanvas())

  const { renderTarget, ...render } = useUnit(ctx, RenderUV)
  render.cameraSource.set(cameraSource)
  render.textureSource.set(textureSource)
  render.vertexSource.set(vertexSource)

  return { renderTarget }
})
