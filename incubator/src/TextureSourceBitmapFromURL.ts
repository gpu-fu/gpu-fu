import { Context, useEffect } from "@gpu-fu/gpu-fu"
import TextureSourceBitmap from "./TextureSourceBitmap"

export default function TextureSourceBitmapFromURL(ctx: Context) {
  const { imageBitmap, label, textureSourceAsGPUTexture } =
    TextureSourceBitmap(ctx)

  // Use the existing label property for a dual-purpose.
  // We use it as the URL to fetch from (though this implies
  // the assumption that the label will always be equal to the URL).
  const url = label

  useEffect(ctx, (ctx) => {
    const currentURL = url.current
    console.log({ currentURL })
    if (!currentURL) return () => {}

    var cancelled = false

    const img = document.createElement("img")
    img.src = currentURL

    img
      .decode()
      .then(() => (cancelled ? undefined : createImageBitmap(img)))
      .then((newImageBitmap) => {
        if (!cancelled && newImageBitmap) imageBitmap.set(newImageBitmap)
      })
      .catch(console.error)

    return () => {
      cancelled = true
    }
  })

  return {
    url,
    textureSourceAsGPUTexture,
  }
}
