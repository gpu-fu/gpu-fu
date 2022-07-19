import {
  Context,
  useGPUAction,
  useGPUResource,
  useInitializedProp,
} from "@gpu-fu/gpu-fu"
import { mat4, vec3 } from "gl-matrix"

const matrixRowCount = 4
const matrixColCount = 4
const matrixTotalBytes = matrixRowCount * matrixColCount * 4

export default function MatrixSourceCamera(ctx: Context) {
  const [targetX, setTargetX] = useInitializedProp(ctx, 0)
  const [targetY, setTargetY] = useInitializedProp(ctx, 0)
  const [targetZ, setTargetZ] = useInitializedProp(ctx, 0)

  const [cameraDistance, setCameraDistance] = useInitializedProp(ctx, 5)
  const [cameraLatitudeRadians, setCameraLatitudeRadians] = useInitializedProp(
    ctx,
    0,
  )
  const [cameraLongitudeRadians, setCameraLongitudeRadians] =
    useInitializedProp(ctx, 0)

  const buffer = useGPUResource(
    ctx,
    (ctx) =>
      ctx.device.createBuffer({
        size: matrixTotalBytes,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      }),
    [],
  )

  useGPUAction(
    ctx,
    (ctx) => {
      const aspectRatio = 1 // TODO: adapt to canvas client size somehow?
      const fieldOfViewRadiansY = degreesToRadians(60) // TODO: configurable?
      const zNear = 1 // TODO: configurable?
      const zFar = 2000 // TODO: configurable?
      const projectionMatrix = mat4.create()
      mat4.perspective(
        projectionMatrix,
        fieldOfViewRadiansY,
        aspectRatio,
        zNear,
        zFar,
      )

      const targetPos = vec3.fromValues(targetX, targetY, targetZ)
      // var cameraPos = vec3.fromValues(0, 0, cameraDistance)
      // vec3.rotateY(came)

      const cameraMatrix = mat4.create()
      mat4.translate(cameraMatrix, cameraMatrix, targetPos)
      mat4.rotateY(cameraMatrix, cameraMatrix, cameraLongitudeRadians)
      mat4.rotateX(cameraMatrix, cameraMatrix, cameraLatitudeRadians)
      mat4.translate(
        cameraMatrix,
        cameraMatrix,
        vec3.fromValues(0, 0, cameraDistance),
      )

      const cameraPos = vec3.create()
      mat4.getTranslation(cameraPos, cameraMatrix)

      const upward = vec3.fromValues(0, 1, 0)

      const viewMatrix = mat4.create() as Float32Array
      mat4.lookAt(viewMatrix, cameraPos, targetPos, upward)

      const projectionViewMatrix = mat4.create()
      mat4.multiply(projectionViewMatrix, projectionMatrix, viewMatrix)

      const data = projectionViewMatrix as Float32Array

      ctx.device.queue.writeBuffer(buffer, 0, data, 0, data.length)
    },
    [
      buffer,
      targetX,
      targetY,
      targetZ,
      cameraDistance,
      cameraLatitudeRadians,
      cameraLongitudeRadians,
    ],
  )

  return {
    targetX,
    targetY,
    targetZ,
    cameraDistance,
    cameraLatitudeRadians,
    cameraLongitudeRadians,
    setTargetX,
    setTargetY,
    setTargetZ,
    setCameraDistance,
    setCameraLatitudeRadians,
    setCameraLongitudeRadians,
    cameraSourceAsGPUBuffer: buffer,
  }
}

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}
