import {
  Context,
  useGPUResource,
  useGPUUpdate,
  useInitializedProp,
} from "@gpu-fu/gpu-fu"
import { mat4, vec3 } from "gl-matrix"

const matrixRowCount = 4
const matrixColCount = 4
const matrixTotalBytes = matrixRowCount * matrixColCount * 4

export default function MatrixSourceCamera(ctx: Context) {
  const targetPosition = useInitializedProp(
    ctx,
    vec3.fromValues(0, 0, 0) as Float32Array,
  )
  const cameraPosition = useInitializedProp(ctx, {
    distance: 5,
    latitudeRadians: 0,
    longitudeRadians: 0,
  })

  const buffer = useGPUResource(ctx, (ctx) =>
    ctx.device.createBuffer({
      size: matrixTotalBytes,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    }),
  )

  useGPUUpdate([buffer], ctx, (ctx) => {
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

    const cameraMatrix = mat4.create()
    mat4.translate(cameraMatrix, cameraMatrix, targetPosition.current)
    mat4.rotateY(
      cameraMatrix,
      cameraMatrix,
      cameraPosition.current.longitudeRadians,
    )
    mat4.rotateX(
      cameraMatrix,
      cameraMatrix,
      cameraPosition.current.latitudeRadians,
    )
    mat4.translate(
      cameraMatrix,
      cameraMatrix,
      vec3.fromValues(0, 0, cameraPosition.current.distance),
    )

    const cameraPos = vec3.create()
    mat4.getTranslation(cameraPos, cameraMatrix)

    const upward = vec3.fromValues(0, 1, 0)

    const viewMatrix = mat4.create() as Float32Array
    mat4.lookAt(viewMatrix, cameraPos, targetPosition.current, upward)

    const projectionViewMatrix = mat4.create()
    mat4.multiply(projectionViewMatrix, projectionMatrix, viewMatrix)

    const data = projectionViewMatrix as Float32Array

    ctx.device.queue.writeBuffer(buffer.current, 0, data, 0, data.length)
  })

  return {
    targetPosition,
    cameraPosition,
    resultMatrixBuffer: buffer,
  }
}

function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}
