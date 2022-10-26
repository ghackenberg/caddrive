import { AmbientLight, Box3, DirectionalLight, Group, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'

export function createCamera(model: Group, width: number, height: number) {
    // Data
    const bound = new Box3().setFromObject(model)
    const center = bound.getCenter(new Vector3())
    const size = bound.getSize(new Vector3())
    const position = center.clone().add(size.clone().multiplyScalar(20))
    const max = Math.max(size.x, size.y, size.z)

    // Camera
    const camera = new PerspectiveCamera(3, width / height, 0.1, max * 100)
    camera.position.set(position.z, position.y, position.x)
    camera.lookAt(center)
    camera.updateProjectionMatrix()

    return camera
}

// Ambient light
const ambient_light = new AmbientLight(0xffffff, 0.5)
// Directional light
const directional_light = new DirectionalLight(0xffffff, 1)
// WebGL renderer
const webgl_renderer = new WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, alpha: true })

export function render(model: Group, width: number, height: number): Promise<Blob> {
    return new Promise<Blob>((resolve, _reject) => {
        // Scene
        const scene = new Scene()
        scene.add(ambient_light)
        scene.add(directional_light)
        scene.add(model)

        // Camera
        const perspective_camera = createCamera(model, width, height)   

        // Renderer
        webgl_renderer.setPixelRatio(window.devicePixelRatio)
        webgl_renderer.setSize(width, height)
        webgl_renderer.render(scene, perspective_camera)
        webgl_renderer.domElement.toBlob(resolve)
    })
}