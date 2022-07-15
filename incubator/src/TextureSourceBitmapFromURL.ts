import { Context, useAsyncPropSetter, useProp } from "@gpu-fu/gpu-fu"
import TextureSourceBitmap from "./TextureSourceBitmap"

export default function TextureSourceBitmapFromURL(ctx: Context) {
  const { setImageBitmap, setLabel, textureSourceAsGPUTexture } =
    TextureSourceBitmap(ctx)

  const [url, setURL] = useProp<string>(ctx)
  setLabel(url)

  useAsyncPropSetter(
    ctx,
    setImageBitmap,
    async (ctx) => {
      if (!url) return
      const img = document.createElement("img")
      img.src = url
      await img.decode()
      const imageBitmap = await createImageBitmap(img)
      return imageBitmap
    },
    [url],
  )

  return {
    setURL,
    textureSourceAsGPUTexture,
  }
}
