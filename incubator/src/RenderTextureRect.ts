/// <reference types="@webgpu/types" />

import { Context, useDerived, useUnit } from "@gpu-fu/gpu-fu"
import RenderUV from "./RenderUV"
import VertexSourceRect from "./VertexSourceRect"

export default function RenderTextureRect(ctx: Context) {
  const { textureSource, vertexBuffer, vertexBufferLayout, renderTarget } =
    RenderUV(ctx)

  const rect = useUnit(ctx, VertexSourceRect)
  vertexBuffer.setFrom(rect.resultVertexBuffer)
  vertexBufferLayout.set(rect.resultVertexBufferLayout)

  // Determine the aspect ratio to fill based on the input and output sizes.
  const aspectFillRatio = useDerived(ctx, (ctx) => {
    if (!textureSource.current) return
    if (!renderTarget.current) return

    return (
      (textureSource.current.width * renderTarget.current.height) /
      (textureSource.current.height * renderTarget.current.width)
    )
  })
  rect.aspectFillRatio.setFrom(aspectFillRatio)

  return { textureSource, renderTarget }
}
