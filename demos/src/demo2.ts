/// <reference types="@webgpu/types" />

import { useUnit } from "@gpu-fu/gpu-fu"
import {
  RenderTextureRect,
  TextureSourceBitmapFromURL,
} from "@gpu-fu/incubator"

import runDemo from "./runDemo"
runDemo((ctx) => {
  const textureSource = useUnit(ctx, TextureSourceBitmapFromURL)
  textureSource.url.set("./assets/fireweed.jpg")

  const { renderTarget, ...render } = useUnit(ctx, RenderTextureRect)
  render.textureSource.set(textureSource)

  return { renderTarget }
})
