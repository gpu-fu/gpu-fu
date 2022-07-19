!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.beta=t():e.beta=t()}("undefined"!=typeof self?self:this,(()=>(()=>{"use strict";var e={};(e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})})(e);class t{constructor(e,t){this._current=e,this._ctx=t}get current(){return this._current}set(e){this._current!==e&&(this._current=e,this._ctx._needsUnitReRun=!0)}change(e){const t=e(this._current);this._current!==t&&(this._current=t,this._ctx._needsUnitReRun=!0)}mutate(e){e(this._current),this._ctx._needsUnitReRun=!0}}class n{constructor(e,t){this._store=[],this._storeIndex=0,this._storeUnits=[],this._storeUnitsIndex=0,this._storeGPUActions=[],this._storeGPUActionsIndex=0,this._needsUnitReRun=!0,this._unitFn=e,this.device=t}_nextStoreIndex(){const e=this._storeIndex;return this._storeIndex=e+1,e}_nextStoreUnitsIndex(){const e=this._storeUnitsIndex;return this._storeUnitsIndex=e+1,e}_nextStoreGPUActionsIndex(){const e=this._storeGPUActionsIndex;return this._storeGPUActionsIndex=e+1,e}runUnitIfNeeded(e){var t=!1;return this._storeUnits.forEach((e=>{const n=e.current;(null==n?void 0:n._ctx.runUnitIfNeeded(n))&&(t=!0)})),!(!this._needsUnitReRun&&!t||(this._storeIndex=0,this._storeUnitsIndex=0,this._storeGPUActionsIndex=0,this._needsUnitReRun=!1,Object.assign(e,this._unitFn(this)),0))}runGPUActionsIfNeeded(e){this._storeUnits.forEach((t=>{const n=t.current;null==n||n._ctx.runGPUActionsIfNeeded(e)})),this.commandEncoder=e,this._storeGPUActions.forEach((([e,t,n],r)=>{n&&(e(this),this._storeGPUActions[r][2]=!1)})),this.commandEncoder=void 0}_useProp(e){const n=this._nextStoreIndex(),r=this._store[n];if(r)return r;const u=new t("function"==typeof e?e():e,this);return this._store[n]=u,u}_useUnitProp(e){const n=this._nextStoreUnitsIndex(),r=this._storeUnits[n];if(r)return r;const u=new t("function"==typeof e?e():e,this);return this._storeUnits[n]=u,u}_useGPUResource(e,t){const n=this._nextStoreIndex(),r=this._store[n];if(!r){const r=e(this);return this._store[n]=[r,t],r}if(t.every(((e,t)=>e===r[1][t])))return r[0];const u=e(this),i=r[0];return r[0]=u,r[1]=t,i&&"function"==typeof i.destroy&&i.destroy(),u}_useGPUAction(e,t){const n=this._nextStoreGPUActionsIndex(),r=this._storeGPUActions[n];r?t.every(((e,t)=>e===r[1][t]))||(r[0]=e,r[1]=t,r[2]=!0):this._storeGPUActions[n]=[e,t,!0]}_useEffect(e,t){const n=this._nextStoreIndex(),r=this._store[n];if(r)t.every(((e,t)=>e===r[1][t]))||(r[0]&&r[0](),r[0]=e({}),r[1]=t);else{const r=e({});this._store[n]=[r,t]}}}function r(e){return e._useProp(void 0)}function u(e){return e._useUnitProp(void 0)}function i(e,t){return e._useUnitProp((()=>function(e,t){const r=new n(t,e);return Object.assign(Object.assign({},t(r)),{_ctx:r})}(e.device,t))).current}function o(e,t,n){return e._useGPUResource(t,n)}function s(e,t,n){e._useGPUAction(t,n)}class c{constructor(e){this._renders=[],this._canvasContext=e}addRender(e){this._renders.includes(e)||this._renders.push(e)}outputFrame(e){const t=this._canvasContext.getCurrentTexture();this._renders.forEach((n=>{n.renderTarget.set(t),n.runFrame(e)}))}}function a(e){const t=r(e),n=o(e,(e=>e.device.createBuffer({size:144,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST})),[]);return s(e,(e=>{if(!n)return;var r=0,u=1,i=0,o=1;t.current&&(t.current<1?o=1-(i=.5-.5*t.current):u=1-(r=.5-.5/t.current));const s=new Float32Array([1,1,0,1,u,i,-1,-1,0,1,r,o,-1,1,0,1,r,i,1,1,0,1,u,i,1,-1,0,1,u,o,-1,-1,0,1,r,o]);e.device.queue.writeBuffer(n,0,s,0,s.length)}),[n,t.current]),{aspectFillRatio:t,vertexSourceCount:6,vertexSourceTotalBytes:144,vertexSourceStrideBytes:24,vertexSourceXYZWOffsetBytes:0,vertexSourceUVOffsetBytes:16,vertexSourceAsGPUBuffer:n}}function d(e){const{textureSource:t,vertexSource:n,renderTarget:c}=function(e){var t,n;const i=u(e),c=u(e),a=u(e),d=r(e),x=null===(t=i.current)||void 0===t?void 0:t.cameraSourceAsGPUBuffer,l=null===(n=a.current)||void 0===n?void 0:n.textureSourceAsGPUTexture,f=o(e,(e=>e.device.createShaderModule({code:"@group(0) @binding(0) var<uniform> use_matrix: mat4x4<f32>;\n@group(0) @binding(1) var use_sampler: sampler;\n@group(0) @binding(2) var use_texture: texture_2d<f32>;\n\nstruct VertexOutput {\n  @builtin(position) pos: vec4<f32>;\n  @location(0) uv: vec2<f32>;\n}\n\n@stage(vertex)\nfn vertexRenderUV(\n  @location(0) pos_in: vec4<f32>,\n  @location(1) uv_in: vec2<f32>,\n) ->\n  VertexOutput\n{\n  var out: VertexOutput;\n  out.pos = pos_in;\n  out.uv = uv_in;\n  return out;\n}\n\n@stage(vertex)\nfn vertexRenderUVWithMatrix(\n  @location(0) pos_in: vec4<f32>,\n  @location(1) uv_in: vec2<f32>,\n) ->\n  VertexOutput\n{\n  var out: VertexOutput;\n  out.pos = use_matrix * pos_in;\n  out.uv = uv_in;\n  return out;\n}\n\n@stage(fragment)\nfn fragmentRenderUV(\n  @location(0) uv_in : vec2<f32>\n) ->\n  @location(0) vec4<f32>\n{\n  return textureSample(use_texture, use_sampler, uv_in.xy);\n}\n"})),[]),v=o(e,(e=>{if(c.current)return e.device.createRenderPipeline({vertex:{module:f,entryPoint:x?"vertexRenderUVWithMatrix":"vertexRenderUV",buffers:[{arrayStride:c.current.vertexSourceStrideBytes,attributes:[{shaderLocation:0,offset:c.current.vertexSourceXYZWOffsetBytes,format:"float32x4"},{shaderLocation:1,offset:c.current.vertexSourceUVOffsetBytes,format:"float32x2"}]}]},fragment:{module:f,entryPoint:"fragmentRenderUV",targets:[{format:"rgba8unorm"}]},primitive:{topology:"triangle-list"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"},layout:void 0})}),[f,c.current]),_=o(e,(e=>e.device.createSampler({magFilter:"linear",minFilter:"linear"})),[]),m=o(e,(e=>{if(!v)return;if(!l)return;const t=[{binding:1,resource:_},{binding:2,resource:l.createView()}];return x&&t.unshift({binding:0,resource:{buffer:x}}),e.device.createBindGroup({layout:v.getBindGroupLayout(0),entries:t})}),[v,x,l,_]),h=o(e,(e=>e.device.createTexture({size:[300,300],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT})),[]);return s(e,(e=>{if(!c.current)return;if(!d.current)return;if(!v)return;if(!m)return;const t=e.commandEncoder.beginRenderPass({colorAttachments:[{view:d.current.createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:h.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});t.setPipeline(v),t.setVertexBuffer(0,c.current.vertexSourceAsGPUBuffer),t.setBindGroup(0,m),t.draw(c.current.vertexSourceCount,1,0,0),t.end()}),[c.current,d.current,v,m]),{cameraSource:i,textureSource:a,vertexSource:c,renderTarget:d}}(e),d=i(e,a);return n.set(d),d.aspectFillRatio.set(850/1275),{textureSource:t,renderTarget:c}}function x(e){var t,n,i;const c=u(e),a=r(e),d=null===(t=c.current)||void 0===t?void 0:t.textureSourceAsGPUTexture,x=null===(n=a.current)||void 0===n?void 0:n.byteLength,l=o(e,(e=>x&&e.device.createBuffer({size:x,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})),[x]);s(e,(e=>{l&&a.current&&e.device.queue.writeBuffer(l,0,a.current,0,a.current.length)}),[l,a.current]);const f=o(e,(e=>{var t;let n;if(10===(null===(t=a.current)||void 0===t?void 0:t.length))return n="@group(0) @binding(0) var<uniform> kernel_3x3: Kernel3x3;\n@group(0) @binding(1) var texture_in: texture_2d<f32>;\n@group(0) @binding(2) var texture_out: texture_storage_2d<rgba8unorm, write>;\n\nstruct Kernel3x3 {\n  bias: f32;\n  aa: f32;\n  ba: f32;\n  ca: f32;\n  ab: f32;\n  bb: f32;\n  cb: f32;\n  ac: f32;\n  bc: f32;\n  cc: f32;\n}\n\n// TODO: What is the most likely optimal workgroup size?\n@stage(compute) @workgroup_size(32, 1, 1)\nfn computeTextureFilterConvolve3x3(\n  @builtin(global_invocation_id) global_id: vec3<u32>,\n) {\n  let b = vec2<i32>(global_id.xy);\n  let a = max(b - 1, vec2<i32>(0));\n  let c = min(b + 1, min(\n    textureDimensions(texture_in),\n    textureDimensions(texture_out),\n  ));\n\n  var sum = vec4<f32>(kernel_3x3.bias);\n\n  sum = sum + kernel_3x3.aa * textureLoad(texture_in, vec2<i32>(a.x, a.y), 0);\n  sum = sum + kernel_3x3.ba * textureLoad(texture_in, vec2<i32>(b.x, a.y), 0);\n  sum = sum + kernel_3x3.ca * textureLoad(texture_in, vec2<i32>(c.x, a.y), 0);\n\n  sum = sum + kernel_3x3.ab * textureLoad(texture_in, vec2<i32>(a.x, b.y), 0);\n  sum = sum + kernel_3x3.bb * textureLoad(texture_in, vec2<i32>(b.x, b.y), 0);\n  sum = sum + kernel_3x3.cb * textureLoad(texture_in, vec2<i32>(c.x, b.y), 0);\n\n  sum = sum + kernel_3x3.ac * textureLoad(texture_in, vec2<i32>(a.x, c.y), 0);\n  sum = sum + kernel_3x3.bc * textureLoad(texture_in, vec2<i32>(b.x, c.y), 0);\n  sum = sum + kernel_3x3.cc * textureLoad(texture_in, vec2<i32>(c.x, c.y), 0);\n\n  textureStore(texture_out, b, sum);\n}\n",e.device.createComputePipeline({compute:{module:e.device.createShaderModule({code:"@group(0) @binding(0) var<uniform> kernel_3x3: Kernel3x3;\n@group(0) @binding(1) var texture_in: texture_2d<f32>;\n@group(0) @binding(2) var texture_out: texture_storage_2d<rgba8unorm, write>;\n\nstruct Kernel3x3 {\n  bias: f32;\n  aa: f32;\n  ba: f32;\n  ca: f32;\n  ab: f32;\n  bb: f32;\n  cb: f32;\n  ac: f32;\n  bc: f32;\n  cc: f32;\n}\n\n// TODO: What is the most likely optimal workgroup size?\n@stage(compute) @workgroup_size(32, 1, 1)\nfn computeTextureFilterConvolve3x3(\n  @builtin(global_invocation_id) global_id: vec3<u32>,\n) {\n  let b = vec2<i32>(global_id.xy);\n  let a = max(b - 1, vec2<i32>(0));\n  let c = min(b + 1, min(\n    textureDimensions(texture_in),\n    textureDimensions(texture_out),\n  ));\n\n  var sum = vec4<f32>(kernel_3x3.bias);\n\n  sum = sum + kernel_3x3.aa * textureLoad(texture_in, vec2<i32>(a.x, a.y), 0);\n  sum = sum + kernel_3x3.ba * textureLoad(texture_in, vec2<i32>(b.x, a.y), 0);\n  sum = sum + kernel_3x3.ca * textureLoad(texture_in, vec2<i32>(c.x, a.y), 0);\n\n  sum = sum + kernel_3x3.ab * textureLoad(texture_in, vec2<i32>(a.x, b.y), 0);\n  sum = sum + kernel_3x3.bb * textureLoad(texture_in, vec2<i32>(b.x, b.y), 0);\n  sum = sum + kernel_3x3.cb * textureLoad(texture_in, vec2<i32>(c.x, b.y), 0);\n\n  sum = sum + kernel_3x3.ac * textureLoad(texture_in, vec2<i32>(a.x, c.y), 0);\n  sum = sum + kernel_3x3.bc * textureLoad(texture_in, vec2<i32>(b.x, c.y), 0);\n  sum = sum + kernel_3x3.cc * textureLoad(texture_in, vec2<i32>(c.x, c.y), 0);\n\n  textureStore(texture_out, b, sum);\n}\n"}),entryPoint:"computeTextureFilterConvolve3x3"},layout:void 0})}),[null===(i=a.current)||void 0===i?void 0:i.length]),v=o(e,(e=>e.device.createTexture({format:"rgba8unorm",size:{width:(null==d?void 0:d.width)||850,height:(null==d?void 0:d.height)||1275},usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING})),[d]),_=o(e,(e=>f&&l&&d&&v&&e.device.createBindGroup({layout:f.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:l}},{binding:1,resource:d.createView()},{binding:2,resource:v.createView()}]})),[f,l,d,v]);return s(e,(e=>{if(!d)return;if(!f)return;if(!_)return;const t=e.commandEncoder.beginComputePass();t.setPipeline(f),t.setBindGroup(0,_),t.dispatch((d.width||850)/32,(d.height||1275)/1),t.end()}),[d,f,_]),{textureSource:c,setKernel3x3:function(e,t,n,r={}){var u,i;if(r.scale||r.normalize){var o=null!==(u=r.scale)&&void 0!==u?u:1;if(r.normalize){var s=0;s=e.reduce(((e,t)=>e+t),s),s=t.reduce(((e,t)=>e+t),s),0!==(s=n.reduce(((e,t)=>e+t),s))&&(o/=s)}1!==o&&(e=e.map((e=>e*o)),t=t.map((e=>e*o)),n=n.map((e=>e*o)))}const c=new Float32Array(10);c[0]=null!==(i=r.bias)&&void 0!==i?i:0,c.set(e,1),c.set(t,4),c.set(n,7),a.set(c)},textureSourceAsGPUTexture:v}}function l(e){const{imageBitmap:t,label:n,textureSourceAsGPUTexture:u}=function(e){var t,n,u,i;const c=r(e),a=r(e),d=null!==(n=null===(t=c.current)||void 0===t?void 0:t.width)&&void 0!==n?n:16,x=null!==(i=null===(u=c.current)||void 0===u?void 0:u.height)&&void 0!==i?i:16,l=o(e,(e=>e.device.createTexture({label:a.current,size:[d,x,1],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT})),[d,x,a.current]);return s(e,(e=>{c.current&&l&&e.device.queue.copyExternalImageToTexture({source:c.current},{texture:l},[c.current.width,c.current.height])}),[c.current,l]),{imageBitmap:c,label:a,textureSourceAsGPUTexture:l}}(e),i=n;return function(e,t,n,r){e._useEffect((e=>{var r=!1;return n().then((e=>r||t(e))).catch((e=>{console.error(e),r=!0})),()=>{r=!0}}),r)}(e,t.set.bind(t),(e=>{return t=this,n=void 0,u=function*(){if(!i.current)return;const e=document.createElement("img");return e.src=i.current,yield e.decode(),yield createImageBitmap(e)},new((r=void 0)||(r=Promise))((function(e,i){function o(e){try{c(u.next(e))}catch(e){i(e)}}function s(e){try{c(u.throw(e))}catch(e){i(e)}}function c(t){var n;t.done?e(t.value):(n=t.value,n instanceof r?n:new r((function(e){e(n)}))).then(o,s)}c((u=u.apply(t,n||[])).next())}));var t,n,r,u}),[i.current]),{url:i,textureSourceAsGPUTexture:u}}var f=function(e,t,n,r){return new(n||(n=Promise))((function(u,i){function o(e){try{c(r.next(e))}catch(e){i(e)}}function s(e){try{c(r.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?u(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(o,s)}c((r=r.apply(e,t||[])).next())}))};function v(){var e,t;const n=null===(t=null===(e=navigator.gpu)||void 0===e?void 0:e.getPreferredCanvasFormat)||void 0===t?void 0:t.bind(navigator.gpu);return n?n():"rgba8unorm"}var _;return _=e=>{const t=i(e,l);t.url.set("./assets/fireweed.jpg");const n=i(e,x);n.textureSource.set(t),n.setKernel3x3([1,2,1],[0,0,0],[-1,-2,-1],{scale:.5,bias:.5});const r=i(e,d),{renderTarget:u}=r;return function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var u=0;for(r=Object.getOwnPropertySymbols(e);u<r.length;u++)t.indexOf(r[u])<0&&Object.prototype.propertyIsEnumerable.call(e,r[u])&&(n[r[u]]=e[r[u]])}return n}(r,["renderTarget"]).textureSource.set(n),{renderTarget:u}},function(e){(()=>f(this,void 0,void 0,(function*(){const e=yield function(e="high-performance"){return f(this,void 0,void 0,(function*(){if(!navigator.gpu)throw new Error("Your browser doesn't have WebGPU enabled!");const t=yield navigator.gpu.requestAdapter({powerPreference:e});if(!t)throw new Error("Failed to get the GPU adapter!");return t.requestDevice()}))}(),t=yield function(e,t){return f(this,void 0,void 0,(function*(){const n=e.getContext("webgpu");if(!n)throw new Error("Failed to get a WebGPU canvas context!");return n.configure({device:t,format:v(),alphaMode:"opaque"}),n}))}(function(){const e=document.querySelector("canvas.main");if(!e)throw new Error("The main canvas wasn't found in the HTML!");return e}(),e),r=((e,t)=>{const r=function(e,t){const r=new n(t,e),u=Object.assign(Object.assign({},t(r)),{_ctx:r});return u.runFrame=e=>function(e,t){const n=e._ctx;n.runUnitIfNeeded(e),n.runGPUActionsIfNeeded(t)}(u,e),u}(e,_),u=new c(t);return u.addRender(r),function(e){u.outputFrame(e)}})(e,t);requestAnimationFrame((function t(){!function(e,t){const n=e.createCommandEncoder();t(n),e.queue.submit([n.finish()])}(e,r),requestAnimationFrame(t)}))})))().catch((e=>{document.querySelector("body").innerHTML=e,console.error(e)}))}(),e})()));
//# sourceMappingURL=demo3.js.map