@group(0) @binding(0) var<uniform> kernel_3x3: Kernel3x3;
@group(0) @binding(1) var texture_in: texture_2d<f32>;
@group(0) @binding(2) var texture_out: texture_storage_2d<rgba8unorm, write>;

struct Kernel3x3 {
  bias: f32;
  aa: f32;
  ba: f32;
  ca: f32;
  ab: f32;
  bb: f32;
  cb: f32;
  ac: f32;
  bc: f32;
  cc: f32;
}

// TODO: What is the most likely optimal workgroup size?
@stage(compute) @workgroup_size(32, 1, 1)
fn computeTextureFilterConvolve3x3(
  @builtin(global_invocation_id) global_id: vec3<u32>,
) {
  let b = vec2<i32>(global_id.xy);
  let a = max(b - 1, vec2<i32>(0));
  let c = min(b + 1, min(
    textureDimensions(texture_in),
    textureDimensions(texture_out),
  ));

  var sum = vec4<f32>(kernel_3x3.bias);

  sum = sum + kernel_3x3.aa * textureLoad(texture_in, vec2<i32>(a.x, a.y), 0);
  sum = sum + kernel_3x3.ba * textureLoad(texture_in, vec2<i32>(b.x, a.y), 0);
  sum = sum + kernel_3x3.ca * textureLoad(texture_in, vec2<i32>(c.x, a.y), 0);

  sum = sum + kernel_3x3.ab * textureLoad(texture_in, vec2<i32>(a.x, b.y), 0);
  sum = sum + kernel_3x3.bb * textureLoad(texture_in, vec2<i32>(b.x, b.y), 0);
  sum = sum + kernel_3x3.cb * textureLoad(texture_in, vec2<i32>(c.x, b.y), 0);

  sum = sum + kernel_3x3.ac * textureLoad(texture_in, vec2<i32>(a.x, c.y), 0);
  sum = sum + kernel_3x3.bc * textureLoad(texture_in, vec2<i32>(b.x, c.y), 0);
  sum = sum + kernel_3x3.cc * textureLoad(texture_in, vec2<i32>(c.x, c.y), 0);

  textureStore(texture_out, b, sum);
}
