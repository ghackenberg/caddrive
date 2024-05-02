// VERTEX

export const VERTEX_SHADER_CODE = `#version 300 es
layout (location=0) in vec2 position;
layout (location=1) in vec4 color;
out vec4 vColor;
void main () {
  gl_Position = vec4(position, 0., 1.);
  vColor = color;
}`

export const VERTEX_SHADER_ENTRY_POINT = 'main'

// FRAGMENT

export const FRAGMENT_SHADER_CODE = `#version 300 es
precision mediump float;
in vec4 vColor;
out vec4 outColor;
void main () {
  outColor = vColor;
}`

export const FRAGMENT_SHADER_ENTRY_POINT = 'main'