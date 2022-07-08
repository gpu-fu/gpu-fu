@stage(fragment)
fn main(
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
