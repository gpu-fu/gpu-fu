@stage(vertex)
fn vertexRenderColoredTriangle(
  @builtin(vertex_index) index: u32
) ->
  @builtin(position) vec4<f32>
{
  let triangle = array<vec2<f32>, 3>(
    vec2<f32>(0.0, 0.433),
    vec2<f32>(-0.5, -0.433),
    vec2<f32>(0.5, -0.433),
  );

  return vec4<f32>(triangle[index], 0.0, 1.0);
}

@stage(fragment)
fn fragmentRenderColoredTriangle(
  @builtin(position) pos_in: vec4<f32>
) ->
  @location(0) vec4<f32>
{
  return vec4<f32>(
    pos_in.x * 0.003,
    pos_in.y * 0.003,
    1.0 - (pos_in.y * 0.003),
    1.0,
  );
}
