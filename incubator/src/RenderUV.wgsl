@group(0) @binding(0) var<uniform> use_matrix: mat4x4<f32>;
@group(0) @binding(1) var use_sampler: sampler;
@group(0) @binding(2) var use_texture: texture_2d<f32>;

struct VertexOutput {
  @builtin(position) pos: vec4<f32>,
  @location(0) uv: vec2<f32>,
}

@stage(vertex)
fn vertexRenderUV(
  @location(0) pos_in: vec4<f32>,
  @location(1) uv_in: vec2<f32>,
) ->
  VertexOutput
{
  var out: VertexOutput;
  out.pos = pos_in;
  out.uv = uv_in;
  return out;
}

@stage(vertex)
fn vertexRenderUVWithMatrix(
  @location(0) pos_in: vec4<f32>,
  @location(1) uv_in: vec2<f32>,
) ->
  VertexOutput
{
  var out: VertexOutput;
  out.pos = use_matrix * pos_in;
  out.uv = uv_in;
  return out;
}

@stage(fragment)
fn fragmentRenderUV(
  @location(0) uv_in : vec2<f32>
) ->
  @location(0) vec4<f32>
{
  return textureSample(use_texture, use_sampler, uv_in.xy);
}
