@stage(vertex)
fn main(
  @builtin(vertex_index) index: u32
) ->
  @builtin(position) vec4<f32>
{
  let triangle = array<vec2<f32>, 3>(
    vec2<f32>(0.0, 0.433),
    vec2<f32>(-0.5, -0.433),
    vec2<f32>(0.5, -0.433)
  );

  return vec4<f32>(triangle[index], 0.0, 1.0);
}
