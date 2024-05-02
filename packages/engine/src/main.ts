import { BindGroupLayout, BufferUsage, ColorTargetStates, DepthStencilState, MultisampleState, PrimitiveState, ShaderStage, VertexFormat, WebGL, WebGL2Device, getCanvasById, vertexBufferLayouts } from 'mugl/assembly'

import { consoleLog } from './glue'
import { FRAGMENT_SHADER_CODE, FRAGMENT_SHADER_ENTRY_POINT, VERTEX_SHADER_CODE, VERTEX_SHADER_ENTRY_POINT } from './shader'
import { set2D } from './util'

consoleLog('Getting canvas')
const canvas = getCanvasById(1, 'test')

consoleLog('Requesting device')
const deviceOpt = WebGL.requestWebGL2Device(canvas)

if (deviceOpt != null) {
    const device = deviceOpt as WebGL2Device
    
    // Create pipeline
    consoleLog('Creating pipeline')
    const vertex = WebGL.createShader(device, {
        code: VERTEX_SHADER_CODE, usage: ShaderStage.Vertex
    })
    const vertexEntryPoint = VERTEX_SHADER_ENTRY_POINT
    const fragment = WebGL.createShader(device, {
        code: FRAGMENT_SHADER_CODE, usage: ShaderStage.Fragment
    })
    const fragmentEntryPoint = FRAGMENT_SHADER_ENTRY_POINT
    const buffers = vertexBufferLayouts([{
        attributes: [
            VertexFormat.F32x2 /* position */,
            VertexFormat.F32x4 /* color */
        ],
        instanced: false
    }])
    const bindGroups: BindGroupLayout[] = []
    const targets: ColorTargetStates | null = null
    const primitive: PrimitiveState = {} as PrimitiveState
    const depthStencil: DepthStencilState | null = null
    const multisample: MultisampleState = {} as MultisampleState
    const pipeline = WebGL.createRenderPipeline(device, {
        vertex, vertexEntryPoint, fragment, fragmentEntryPoint, buffers, bindGroups, targets, primitive, depthStencil, multisample
    })

    // Create triangle
    consoleLog('Creating triangle')
    const triangle = new Float32Array(6 * 3)
    set2D(triangle, 0, +0.0, +0.5, 1.0, 0.0, 0.0, 1.0)
    set2D(triangle, 1, +0.5, -0.5, 0.0, 1.0, 0.0, 1.0)
    set2D(triangle, 2, -0.5, -0.5, 0.0, 0.0, 1.0, 1.0)
    const buffer = WebGL.createBuffer(device, {
        size: triangle.length, usage: BufferUsage.Vertex
    })
    WebGL.writeBuffer(device, buffer, triangle)

    // Render scene
    consoleLog('Rendering scene')
    WebGL.beginRenderPass(device)
        WebGL.setRenderPipeline(device, pipeline)
        WebGL.setVertex(device, 0, buffer)
        WebGL.draw(device, 3)
    WebGL.submitRenderPass(device)

    // Destroy objects
    consoleLog('Destroying objects')
    vertex.destroy()
    fragment.destroy()
    pipeline.destroy()
    buffer.destroy()
    device.destroy()
}