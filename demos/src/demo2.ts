/// <reference types="@webgpu/types" />

import { useUnit } from "@gpu-fu/gpu-fu"
import {
  RenderTextureRect,
  TextureSourceBitmapFromURL,
} from "@gpu-fu/incubator"

import runDemo from "./runDemo"
runDemo((ctx) => {
  const textureSource = useUnit(ctx, TextureSourceBitmapFromURL)
  textureSource.setURL("./assets/fireweed.jpg")

  const { setRenderTarget, ...render } = useUnit(ctx, RenderTextureRect)
  render.setTextureSource(textureSource)

  return { setRenderTarget }
})
