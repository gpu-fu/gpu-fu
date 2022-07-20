/// <reference types="@webgpu/types" />

import { PropertyReadOnly } from "./Property"

export default interface MatrixSource {
  cameraSourceAsGPUBuffer: PropertyReadOnly<GPUBuffer>
}
