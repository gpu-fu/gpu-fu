/// <reference types="@webgpu/types" />

// Some browsers don't yet support the `layout: "auto"`, so for them
// we introduce this hack that pretends that `undefined` is that string
// at the TypeScript level, so that the browser can fill it in as the default,
// despite the types no longer allowing for it to be undefined.
//
// Eventually this hack will stop working and we'll just replace this
// with actually returning the string "auto" and it will be better.
export function autoLayout() {
  return undefined as unknown as GPUAutoLayoutMode
}
