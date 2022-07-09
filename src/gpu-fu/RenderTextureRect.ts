/// <reference types="@webgpu/types" />

import Context from "./Context"
import Render from "./Render"
import RenderUV from "./RenderUV"
import TextureSource from "./TextureSource"
import VertexSourceRect from "./VertexSourceRect"

export default class RenderTextureRect implements Render {
  private _renderUV = new RenderUV()

  constructor() {
    this._renderUV.setVertexSource(new VertexSourceRect())
  }

  setTextureSource(textureSource: TextureSource) {
    this._renderUV.setTextureSource(textureSource)
  }

  renderFrame(ctx: Context, frame: number, target: GPUTexture): void {
    // TODO : Use the source texture and target texture aspect ratios
    // instead of hard-coding a number here.
    // This doesn't yet work on the latest version of chromium, because
    // those chromium builds don't yet expose texture width and height.
    ;(this._renderUV.getVertexSource() as VertexSourceRect).setAspectFillRatio(
      850 / 1275
    )
    this._renderUV.renderFrame(ctx, frame, target)
  }
}
