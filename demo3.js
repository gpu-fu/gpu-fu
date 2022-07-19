!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.beta=t():e.beta=t()}("undefined"!=typeof self?self:this,(()=>(()=>{"use strict";var e={};(e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})})(e);var t=function(){function e(e,t){this._store=[],this._storeIndex=0,this._storeUnits=[],this._storeUnitsIndex=0,this._storeGPUActions=[],this._storeGPUActionsIndex=0,this._needsUnitReRun=!0,this._unitFn=e,this.device=t}return e.prototype._nextStoreIndex=function(){var e=this._storeIndex;return this._storeIndex=e+1,e},e.prototype._nextStoreUnitsIndex=function(){var e=this._storeUnitsIndex;return this._storeUnitsIndex=e+1,e},e.prototype._nextStoreGPUActionsIndex=function(){var e=this._storeGPUActionsIndex;return this._storeGPUActionsIndex=e+1,e},e.prototype.runUnitIfNeeded=function(e){var t=!1;return this._storeUnits.forEach((function(e){var n=e[0];e[1],(null==n?void 0:n._ctx.runUnitIfNeeded(n))&&(t=!0)})),!(!this._needsUnitReRun&&!t||(this._storeIndex=0,this._storeUnitsIndex=0,this._storeGPUActionsIndex=0,this._needsUnitReRun=!1,Object.assign(e,this._unitFn(this)),0))},e.prototype.runGPUActionsIfNeeded=function(e){var t=this;this._storeUnits.forEach((function(t){var n=t[0];t[1],null==n||n._ctx.runGPUActionsIfNeeded(e)})),this.commandEncoder=e,this._storeGPUActions.forEach((function(e,n){var r=e[0];e[1],e[2]&&(r(t),t._storeGPUActions[n][2]=!1)})),this.commandEncoder=void 0},e.prototype._useProp=function(e){var t=this._nextStoreIndex(),n=this._store[t];if(n)return n;var r=this,u=[];return u[0]="function"==typeof e?e():e,u[1]=function(e){var t=u[0],n="function"==typeof e?e(t):e;n!==t&&(u[0]=n,r._needsUnitReRun=!0)},this._store[t]=u,u},e.prototype._useUnitProp=function(e){var t=this._nextStoreUnitsIndex(),n=this._storeUnits[t];if(n)return n;var r=this,u=[];return u[0]="function"==typeof e?e():e,u[1]=function(e){var t=u[0],n="function"==typeof e?e(t):e;n!==t&&(u[0]=n,r._needsUnitReRun=!0)},this._storeUnits[t]=u,u},e.prototype._useGPUResource=function(e,t){var n=this._nextStoreIndex(),r=this._store[n];if(!r){var u=e(this);return this._store[n]=[u,t],u}if(t.every((function(e,t){return e===r[1][t]})))return r[0];var o=e(this),i=r[0];return r[0]=o,r[1]=t,i&&"function"==typeof i.destroy&&i.destroy(),o},e.prototype._useGPUAction=function(e,t){var n=this._nextStoreGPUActionsIndex(),r=this._storeGPUActions[n];r?t.every((function(e,t){return e===r[1][t]}))||(r[0]=e,r[1]=t,r[2]=!0):this._storeGPUActions[n]=[e,t,!0]},e.prototype._useEffect=function(e,t){var n=this._nextStoreIndex(),r=this._store[n];if(r)t.every((function(e,t){return e===r[1][t]}))||(r[0]&&r[0](),r[0]=e({}),r[1]=t);else{var u=e({});this._store[n]=[u,t]}},e}(),n=function(){return n=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var u in t=arguments[n])Object.prototype.hasOwnProperty.call(t,u)&&(e[u]=t[u]);return e},n.apply(this,arguments)};function r(e){return e._useProp(void 0)}function u(e){return e._useUnitProp(void 0)}function o(e,r){return e._useUnitProp((function(){return function(e,r){var u=new t(r,e);return n(n({},r(u)),{_ctx:u})}(e.device,r)}))[0]}function i(e,t,n){return e._useGPUResource(t,n)}function a(e,t,n){e._useGPUAction(t,n)}const c=function(){function e(e){this._renders=[],this._canvasContext=e}return e.prototype.addRender=function(e){this._renders.includes(e)||this._renders.push(e)},e.prototype.outputFrame=function(e){var t=this._canvasContext.getCurrentTexture();this._renders.forEach((function(n){n.setRenderTarget(t),n.runFrame(e)}))},e}();function s(e){var t=r(e),n=t[0],u=t[1],o=i(e,(function(e){return e.device.createBuffer({size:144,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST})}),[]);return a(e,(function(e){if(o){var t=0,r=1,u=0,i=1;n&&(n<1?i=1-(u=.5-.5*n):r=1-(t=.5-.5/n));var a=new Float32Array([1,1,0,1,r,u,-1,-1,0,1,t,i,-1,1,0,1,t,u,1,1,0,1,r,u,1,-1,0,1,r,i,-1,-1,0,1,t,i]);e.device.queue.writeBuffer(o,0,a,0,a.length)}}),[o,n]),{setAspectFillRatio:u,vertexSourceCount:6,vertexSourceTotalBytes:144,vertexSourceStrideBytes:24,vertexSourceXYZWOffsetBytes:0,vertexSourceUVOffsetBytes:16,vertexSourceAsGPUBuffer:o}}function f(e){var t=function(e){var t=u(e),n=t[0],o=t[1],c=u(e),s=c[0],f=c[1],l=u(e),d=l[0],x=l[1],v=r(e),p=v[0],h=v[1],m=null==n?void 0:n.cameraSourceAsGPUBuffer,_=null==d?void 0:d.textureSourceAsGPUTexture,b=i(e,(function(e){return e.device.createShaderModule({code:"@group(0) @binding(0) var<uniform> use_matrix: mat4x4<f32>;\n@group(0) @binding(1) var use_sampler: sampler;\n@group(0) @binding(2) var use_texture: texture_2d<f32>;\n\nstruct VertexOutput {\n  @builtin(position) pos: vec4<f32>;\n  @location(0) uv: vec2<f32>;\n}\n\n@stage(vertex)\nfn vertexRenderUV(\n  @location(0) pos_in: vec4<f32>,\n  @location(1) uv_in: vec2<f32>,\n) ->\n  VertexOutput\n{\n  var out: VertexOutput;\n  out.pos = pos_in;\n  out.uv = uv_in;\n  return out;\n}\n\n@stage(vertex)\nfn vertexRenderUVWithMatrix(\n  @location(0) pos_in: vec4<f32>,\n  @location(1) uv_in: vec2<f32>,\n) ->\n  VertexOutput\n{\n  var out: VertexOutput;\n  out.pos = use_matrix * pos_in;\n  out.uv = uv_in;\n  return out;\n}\n\n@stage(fragment)\nfn fragmentRenderUV(\n  @location(0) uv_in : vec2<f32>\n) ->\n  @location(0) vec4<f32>\n{\n  return textureSample(use_texture, use_sampler, uv_in.xy);\n}\n"})}),[]),g=i(e,(function(e){return s&&e.device.createRenderPipeline({vertex:{module:b,entryPoint:m?"vertexRenderUVWithMatrix":"vertexRenderUV",buffers:[{arrayStride:s.vertexSourceStrideBytes,attributes:[{shaderLocation:0,offset:s.vertexSourceXYZWOffsetBytes,format:"float32x4"},{shaderLocation:1,offset:s.vertexSourceUVOffsetBytes,format:"float32x2"}]}]},fragment:{module:b,entryPoint:"fragmentRenderUV",targets:[{format:"rgba8unorm"}]},primitive:{topology:"triangle-list"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"},layout:void 0})}),[b,s]),y=i(e,(function(e){return e.device.createSampler({magFilter:"linear",minFilter:"linear"})}),[]),U=i(e,(function(e){if(g&&_){var t=[{binding:1,resource:y},{binding:2,resource:_.createView()}];return m&&t.unshift({binding:0,resource:{buffer:m}}),e.device.createBindGroup({layout:g.getBindGroupLayout(0),entries:t})}}),[g,m,_,y]),P=i(e,(function(e){return e.device.createTexture({size:[300,300],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT})}),[]);return a(e,(function(e){if(d&&s&&g&&U&&p){var t=e.commandEncoder.beginRenderPass({colorAttachments:[{view:p.createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:P.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}});t.setPipeline(g),t.setVertexBuffer(0,s.vertexSourceAsGPUBuffer),t.setBindGroup(0,U),t.draw(s.vertexSourceCount,1,0,0),t.end()}}),[d,s,g,U,p]),{setCameraMatrixSource:o,setTextureSource:x,setVertexSource:f,setRenderTarget:h}}(e),n=t.setTextureSource,c=t.setVertexSource,f=t.setRenderTarget,l=o(e,s);return c(l),l.setAspectFillRatio(850/1275),{setTextureSource:n,setRenderTarget:f}}function l(e){var t=u(e),n=t[0],o=t[1],c=r(e),s=c[0],f=c[1],l=null==n?void 0:n.textureSourceAsGPUTexture,d=i(e,(function(e){return(null==s?void 0:s.byteLength)&&e.device.createBuffer({size:null==s?void 0:s.byteLength,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST})}),[null==s?void 0:s.byteLength]);a(e,(function(e){d&&s&&e.device.queue.writeBuffer(d,0,s,0,s.length)}),[d,s]);var x=i(e,(function(e){if(10===(null==s?void 0:s.length))return"@group(0) @binding(0) var<uniform> kernel_3x3: Kernel3x3;\n@group(0) @binding(1) var texture_in: texture_2d<f32>;\n@group(0) @binding(2) var texture_out: texture_storage_2d<rgba8unorm, write>;\n\nstruct Kernel3x3 {\n  bias: f32;\n  aa: f32;\n  ba: f32;\n  ca: f32;\n  ab: f32;\n  bb: f32;\n  cb: f32;\n  ac: f32;\n  bc: f32;\n  cc: f32;\n}\n\n// TODO: What is the most likely optimal workgroup size?\n@stage(compute) @workgroup_size(32, 1, 1)\nfn computeTextureFilterConvolve3x3(\n  @builtin(global_invocation_id) global_id: vec3<u32>,\n) {\n  let b = vec2<i32>(global_id.xy);\n  let a = max(b - 1, vec2<i32>(0));\n  let c = min(b + 1, min(\n    textureDimensions(texture_in),\n    textureDimensions(texture_out),\n  ));\n\n  var sum = vec4<f32>(kernel_3x3.bias);\n\n  sum = sum + kernel_3x3.aa * textureLoad(texture_in, vec2<i32>(a.x, a.y), 0);\n  sum = sum + kernel_3x3.ba * textureLoad(texture_in, vec2<i32>(b.x, a.y), 0);\n  sum = sum + kernel_3x3.ca * textureLoad(texture_in, vec2<i32>(c.x, a.y), 0);\n\n  sum = sum + kernel_3x3.ab * textureLoad(texture_in, vec2<i32>(a.x, b.y), 0);\n  sum = sum + kernel_3x3.bb * textureLoad(texture_in, vec2<i32>(b.x, b.y), 0);\n  sum = sum + kernel_3x3.cb * textureLoad(texture_in, vec2<i32>(c.x, b.y), 0);\n\n  sum = sum + kernel_3x3.ac * textureLoad(texture_in, vec2<i32>(a.x, c.y), 0);\n  sum = sum + kernel_3x3.bc * textureLoad(texture_in, vec2<i32>(b.x, c.y), 0);\n  sum = sum + kernel_3x3.cc * textureLoad(texture_in, vec2<i32>(c.x, c.y), 0);\n\n  textureStore(texture_out, b, sum);\n}\n",e.device.createComputePipeline({compute:{module:e.device.createShaderModule({code:"@group(0) @binding(0) var<uniform> kernel_3x3: Kernel3x3;\n@group(0) @binding(1) var texture_in: texture_2d<f32>;\n@group(0) @binding(2) var texture_out: texture_storage_2d<rgba8unorm, write>;\n\nstruct Kernel3x3 {\n  bias: f32;\n  aa: f32;\n  ba: f32;\n  ca: f32;\n  ab: f32;\n  bb: f32;\n  cb: f32;\n  ac: f32;\n  bc: f32;\n  cc: f32;\n}\n\n// TODO: What is the most likely optimal workgroup size?\n@stage(compute) @workgroup_size(32, 1, 1)\nfn computeTextureFilterConvolve3x3(\n  @builtin(global_invocation_id) global_id: vec3<u32>,\n) {\n  let b = vec2<i32>(global_id.xy);\n  let a = max(b - 1, vec2<i32>(0));\n  let c = min(b + 1, min(\n    textureDimensions(texture_in),\n    textureDimensions(texture_out),\n  ));\n\n  var sum = vec4<f32>(kernel_3x3.bias);\n\n  sum = sum + kernel_3x3.aa * textureLoad(texture_in, vec2<i32>(a.x, a.y), 0);\n  sum = sum + kernel_3x3.ba * textureLoad(texture_in, vec2<i32>(b.x, a.y), 0);\n  sum = sum + kernel_3x3.ca * textureLoad(texture_in, vec2<i32>(c.x, a.y), 0);\n\n  sum = sum + kernel_3x3.ab * textureLoad(texture_in, vec2<i32>(a.x, b.y), 0);\n  sum = sum + kernel_3x3.bb * textureLoad(texture_in, vec2<i32>(b.x, b.y), 0);\n  sum = sum + kernel_3x3.cb * textureLoad(texture_in, vec2<i32>(c.x, b.y), 0);\n\n  sum = sum + kernel_3x3.ac * textureLoad(texture_in, vec2<i32>(a.x, c.y), 0);\n  sum = sum + kernel_3x3.bc * textureLoad(texture_in, vec2<i32>(b.x, c.y), 0);\n  sum = sum + kernel_3x3.cc * textureLoad(texture_in, vec2<i32>(c.x, c.y), 0);\n\n  textureStore(texture_out, b, sum);\n}\n"}),entryPoint:"computeTextureFilterConvolve3x3"},layout:void 0})}),[null==s?void 0:s.length]),v=(i(e,(function(e){return e.device.createSampler({magFilter:"linear",minFilter:"linear"})}),[]),i(e,(function(e){return e.device.createTexture({format:"rgba8unorm",size:{width:(null==l?void 0:l.width)||850,height:(null==l?void 0:l.height)||1275},usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING})}),[l])),p=i(e,(function(e){return x&&d&&l&&v&&e.device.createBindGroup({layout:x.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:d}},{binding:1,resource:l.createView()},{binding:2,resource:v.createView()}]})}),[x,d,l,v]);return a(e,(function(e){if(l&&x&&p){var t=e.commandEncoder.beginComputePass();t.setPipeline(x),t.setBindGroup(0,p),t.dispatch((l.width||850)/32,(l.height||1275)/1),t.end()}}),[l,x,p]),{setTextureSource:o,setKernel3x3:function(e,t,n,r){var u,o;if(void 0===r&&(r={}),r.scale||r.normalize){var i=null!==(u=r.scale)&&void 0!==u?u:1;if(r.normalize){var a=0;a=e.reduce((function(e,t){return e+t}),a),a=t.reduce((function(e,t){return e+t}),a),0!==(a=n.reduce((function(e,t){return e+t}),a))&&(i/=a)}1!==i&&(e=e.map((function(e){return e*i})),t=t.map((function(e){return e*i})),n=n.map((function(e){return e*i})))}var c=new Float32Array(10);c[0]=null!==(o=r.bias)&&void 0!==o?o:0,c.set(e,1),c.set(t,4),c.set(n,7),f(c)},textureSourceAsGPUTexture:v}}function d(e){var t=this,n=function(e){var t,n,u=r(e),o=u[0],c=u[1],s=r(e),f=s[0],l=s[1],d=null!==(t=null==o?void 0:o.width)&&void 0!==t?t:16,x=null!==(n=null==o?void 0:o.height)&&void 0!==n?n:16,v=i(e,(function(e){return e.device.createTexture({label:f,size:[d,x,1],format:"rgba8unorm",usage:GPUTextureUsage.TEXTURE_BINDING|GPUTextureUsage.COPY_DST|GPUTextureUsage.RENDER_ATTACHMENT})}),[d,x,f]);return a(e,(function(e){o&&v&&e.device.queue.copyExternalImageToTexture({source:o},{texture:v},[o.width,o.height])}),[o,v]),{setImageBitmap:c,setLabel:l,textureSourceAsGPUTexture:v}}(e),u=n.setImageBitmap,o=n.setLabel,c=n.textureSourceAsGPUTexture,s=r(e),f=s[0],l=s[1];return o(f),function(e,n,r,u){e._useEffect((function(e){var r,u,o,i,a=!1;return(r=t,u=void 0,o=void 0,i=function(){var e;return function(e,t){var n,r,u,o,i={label:0,sent:function(){if(1&u[0])throw u[1];return u[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,r&&(u=2&o[0]?r.return:o[0]?r.throw||((u=r.return)&&u.call(r),0):r.next)&&!(u=u.call(r,o[1])).done)return u;switch(r=0,u&&(o=[2&o[0],u.value]),o[0]){case 0:case 1:u=o;break;case 4:return i.label++,{value:o[1],done:!1};case 5:i.label++,r=o[1],o=[0];continue;case 7:o=i.ops.pop(),i.trys.pop();continue;default:if(!((u=(u=i.trys).length>0&&u[u.length-1])||6!==o[0]&&2!==o[0])){i=0;continue}if(3===o[0]&&(!u||o[1]>u[0]&&o[1]<u[3])){i.label=o[1];break}if(6===o[0]&&i.label<u[1]){i.label=u[1],u=o;break}if(u&&i.label<u[2]){i.label=u[2],i.ops.push(o);break}u[2]&&i.ops.pop(),i.trys.pop();continue}o=t.call(e,i)}catch(e){o=[6,e],r=0}finally{n=u=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}}(this,(function(t){switch(t.label){case 0:return f?((e=document.createElement("img")).src=f,[4,e.decode()]):[2];case 1:return t.sent(),[4,createImageBitmap(e)];case 2:return[2,t.sent()]}}))},new(o||(o=Promise))((function(e,t){function n(e){try{c(i.next(e))}catch(e){t(e)}}function a(e){try{c(i.throw(e))}catch(e){t(e)}}function c(t){var r;t.done?e(t.value):(r=t.value,r instanceof o?r:new o((function(e){e(r)}))).then(n,a)}c((i=i.apply(r,u||[])).next())}))).then((function(e){return a||n(e)})).catch((function(e){console.error(e),a=!0})),function(){a=!0}}),u)}(e,u,0,[f]),{setURL:l,textureSourceAsGPUTexture:c}}var x=function(e,t,n,r){return new(n||(n=Promise))((function(u,o){function i(e){try{c(r.next(e))}catch(e){o(e)}}function a(e){try{c(r.throw(e))}catch(e){o(e)}}function c(e){var t;e.done?u(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,a)}c((r=r.apply(e,t||[])).next())}))},v=function(e,t){var n,r,u,o,i={label:0,sent:function(){if(1&u[0])throw u[1];return u[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;i;)try{if(n=1,r&&(u=2&o[0]?r.return:o[0]?r.throw||((u=r.return)&&u.call(r),0):r.next)&&!(u=u.call(r,o[1])).done)return u;switch(r=0,u&&(o=[2&o[0],u.value]),o[0]){case 0:case 1:u=o;break;case 4:return i.label++,{value:o[1],done:!1};case 5:i.label++,r=o[1],o=[0];continue;case 7:o=i.ops.pop(),i.trys.pop();continue;default:if(!((u=(u=i.trys).length>0&&u[u.length-1])||6!==o[0]&&2!==o[0])){i=0;continue}if(3===o[0]&&(!u||o[1]>u[0]&&o[1]<u[3])){i.label=o[1];break}if(6===o[0]&&i.label<u[1]){i.label=u[1],u=o;break}if(u&&i.label<u[2]){i.label=u[2],i.ops.push(o);break}u[2]&&i.ops.pop(),i.trys.pop();continue}o=t.call(e,i)}catch(e){o=[6,e],r=0}finally{n=u=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}};function p(e){return void 0===e&&(e="high-performance"),x(this,void 0,void 0,(function(){var t;return v(this,(function(n){switch(n.label){case 0:if(!navigator.gpu)throw new Error("Your browser doesn't have WebGPU enabled!");return[4,navigator.gpu.requestAdapter({powerPreference:e})];case 1:if(!(t=n.sent()))throw new Error("Failed to get the GPU adapter!");return[2,t.requestDevice()]}}))}))}function h(){var e=document.querySelector("canvas.main");if(!e)throw new Error("The main canvas wasn't found in the HTML!");return e}function m(e,t){return x(this,void 0,void 0,(function(){var n;return v(this,(function(r){if(!(n=e.getContext("webgpu")))throw new Error("Failed to get a WebGPU canvas context!");return n.configure({device:t,format:_(),alphaMode:"opaque"}),[2,n]}))}))}function _(){var e,t,n=null===(t=null===(e=navigator.gpu)||void 0===e?void 0:e.getPreferredCanvasFormat)||void 0===t?void 0:t.bind(navigator.gpu);return n?n():"rgba8unorm"}var b;return b=function(e){var t=o(e,d);t.setURL("./assets/fireweed.jpg");var n=o(e,l);n.setTextureSource(t),n.setKernel3x3([1,2,1],[0,0,0],[-1,-2,-1],{scale:.5,bias:.5});var r=o(e,f),u=r.setRenderTarget;return function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var u=0;for(r=Object.getOwnPropertySymbols(e);u<r.length;u++)t.indexOf(r[u])<0&&Object.prototype.propertyIsEnumerable.call(e,r[u])&&(n[r[u]]=e[r[u]])}return n}(r,["setRenderTarget"]).setTextureSource(n),{setRenderTarget:u}},function(e){x(this,void 0,void 0,(function(){function e(){!function(e,t){var n=e.createCommandEncoder();t(n),e.queue.submit([n.finish()])}(r,o),requestAnimationFrame(e)}var r,u,o;return v(this,(function(i){switch(i.label){case 0:return[4,p()];case 1:return r=i.sent(),[4,m(h(),r)];case 2:return u=i.sent(),o=function(e,r){var u=function(e,r){var u=new t(r,e),o=n(n({},r(u)),{_ctx:u});return o.runFrame=function(e){return function(e,t){var n=e._ctx;n.runUnitIfNeeded(e),n.runGPUActionsIfNeeded(t)}(o,e)},o}(e,b),o=new c(r);return o.addRender(u),function(e){o.outputFrame(e)}}(r,u),requestAnimationFrame(e),[2]}}))})).catch((function(e){document.querySelector("body").innerHTML=e,console.error(e)}))}(),e})()));
//# sourceMappingURL=demo3.js.map