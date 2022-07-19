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
  textureSource.setURL("./assets/fireweed.jpg")

  cameraSource.setCanvas(getDemoCanvas())

  const { setRenderTarget, ...render } = useUnit(ctx, RenderUV)
  render.setCameraMatrixSource(cameraSource)
  render.setTextureSource(textureSource)
  render.setVertexSource(vertexSource)

  return { setRenderTarget }
})
