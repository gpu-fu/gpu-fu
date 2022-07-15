/// <reference types="@webgpu/types" />

import { Context, useUnit } from "@gpu-fu/gpu-fu"
import RenderUV from "./RenderUV"
import VertexSourceRect from "./VertexSourceRect"

export default function RenderTextureRect(ctx: Context) {
  const { setTextureSource, setVertexSource, setRenderTarget } = RenderUV(ctx)

  const rect = useUnit(ctx, VertexSourceRect)
  setVertexSource(rect)

  // TODO: Use the source texture and target texture aspect ratios
  // instead of hard-coding a number here.
  // This doesn't yet work on the latest version of chromium, because
  // those chromium builds don't yet expose texture width and height.
  rect.setAspectFillRatio(850 / 1275)

  return { setTextureSource, setRenderTarget }
}
