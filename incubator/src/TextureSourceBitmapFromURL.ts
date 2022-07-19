import { Context, useAsyncPropSetter, useProp } from "@gpu-fu/gpu-fu"
import TextureSourceBitmap from "./TextureSourceBitmap"

export default function TextureSourceBitmapFromURL(ctx: Context) {
  const { imageBitmap, label, textureSourceAsGPUTexture } =
    TextureSourceBitmap(ctx)

  // Use the existing label property for a dual-purpose.
  // We use it as the URL to fetch from (though this implies
  // the assumption that the label will always be equal to the URL).
  const url = label

  useAsyncPropSetter(
    ctx,
    imageBitmap.set.bind(imageBitmap),
    async (ctx) => {
      if (!url.current) return
      const img = document.createElement("img")
      img.src = url.current
      await img.decode()
      const imageBitmap = await createImageBitmap(img)
      return imageBitmap
    },
    [url.current],
  )

  return {
    url,
    textureSourceAsGPUTexture,
  }
}
