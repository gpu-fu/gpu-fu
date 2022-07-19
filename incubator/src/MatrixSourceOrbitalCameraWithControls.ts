import { Context, useProp, useEffect } from "@gpu-fu/gpu-fu"
import { vec3 } from "gl-matrix"
import MatrixSourceOrbitalCamera from "./MatrixSourceOrbitalCamera"

export default function MatrixSourceOrbitalCameraWithControls(ctx: Context) {
  const cameraSource = MatrixSourceOrbitalCamera(ctx)
  const canvas = useProp<HTMLCanvasElement>(ctx)

  useEffect(
    ctx,
    (ctx) => {
      const currentCanvas = canvas.current
      if (!currentCanvas) return () => {}

      const maxLatitudeRadians = Math.PI / 2 - 0.05
      var lastClientX = 0
      var lastClientY = 0

      const onPointerMove = (event: PointerEvent) => {
        const deltaX = event.clientX - lastClientX
        const deltaY = event.clientY - lastClientY
        lastClientX = event.clientX
        lastClientY = event.clientY

        if (event.altKey) {
          const longitudeRadians =
            cameraSource.cameraPosition.current.longitudeRadians
          const latitudeRadians =
            cameraSource.cameraPosition.current.latitudeRadians

          // The 2D X axis is always perpendicular to the 3D Y axis, so changes
          // along the 2D X axis never affect the 3D Y axis.
          // However, changes along the 2D Y axis can affect all three axes.
          const scale = 0.02 // TODO: compute based on current cameraDistance, canvas size, field of view, etc.
          const deltaY3D = scale * deltaY * Math.cos(latitudeRadians)
          const deltaX3D =
            scale *
            (deltaX * -Math.cos(longitudeRadians) +
              deltaY * Math.sin(latitudeRadians) * Math.sin(longitudeRadians))
          const deltaZ3D =
            scale *
            (deltaX * Math.sin(longitudeRadians) +
              deltaY * Math.sin(latitudeRadians) * Math.cos(longitudeRadians))

          // TODO: Use `mutate` instead of `change`, to preserve the same vec3.
          cameraSource.targetPosition.change(
            (current) =>
              vec3.fromValues(
                current[0] + deltaX3D,
                current[1] + deltaY3D,
                current[2] + deltaZ3D,
              ) as Float32Array,
          )
        } else {
          // TODO: Use `mutate` instead of `change`, to preserve the same object.
          cameraSource.cameraPosition.change((current) => ({
            distance: current.distance,
            longitudeRadians: current.longitudeRadians - deltaX * 0.01,
            latitudeRadians: Math.min(
              maxLatitudeRadians,
              Math.max(
                -maxLatitudeRadians,
                current.latitudeRadians - deltaY * 0.01,
              ),
            ),
          }))
        }
      }

      const onPointerDown = (event: PointerEvent) => {
        currentCanvas.style.cursor = "grabbing"

        lastClientX = event.clientX
        lastClientY = event.clientY

        currentCanvas.addEventListener("pointermove", onPointerMove)
        currentCanvas.setPointerCapture(event.pointerId)
      }

      const onPointerUp = (event: PointerEvent) => {
        currentCanvas.style.cursor = "grab"

        currentCanvas.removeEventListener("pointermove", onPointerMove)
      }

      currentCanvas.style.cursor = "grab"

      currentCanvas.addEventListener("pointerdown", onPointerDown)
      currentCanvas.addEventListener("pointerup", onPointerUp)

      return () => {
        currentCanvas.style.cursor = "auto"

        currentCanvas.removeEventListener("pointerdown", onPointerDown)
        currentCanvas.removeEventListener("pointerup", onPointerUp)
        currentCanvas.removeEventListener("pointermove", onPointerMove)
      }
    },
    [canvas.current],
  )

  return Object.assign(cameraSource, { canvas })
}
