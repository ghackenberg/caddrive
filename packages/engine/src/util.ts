export function set2D(buffer: Float32Array, i: i32, x: f32, y: f32, r: f32, g: f32, b: f32, a: f32): void {
    buffer[i * 6 + 0] = x
    buffer[i * 6 + 1] = y
    buffer[i * 6 + 2] = r
    buffer[i * 6 + 3] = g
    buffer[i * 6 + 4] = b
    buffer[i * 6 + 5] = a
}