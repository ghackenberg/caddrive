import { AmbientLight, Box3, DirectionalLight, Group, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'

export function createCamera(model: Group, width: number, height: number) {
    // Data
    const bound = new Box3().setFromObject(model)
    const center = bound.getCenter(new Vector3())
    const size = bound.getSize(new Vector3())
    const max = Math.max(size.x, size.y, size.z)
    const position = center.clone().add(new Vector3(max * 15, - max * 15, max * 30))

    console.log(center.x, center.y, center.z)
    console.log(size.x, size.y, size.z)
    console.log(position.x, position.y, position.z)

    // Camera
    const camera = new PerspectiveCamera(3, width / height, 0.1, max * 100)
    camera.position.set(position.z, position.y, position.x)
    camera.up.set(0, -1, 0)
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

export function render(model: Group, width: number, height: number): Promise<{ blob: Blob, dataUrl: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return new Promise<{ blob: Blob, dataUrl: string }>((resolve, _reject) => {
        // TODO handle error and remove eslint comment

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

        // Convert to data URL
        const dataUrl = webgl_renderer.domElement.toDataURL()
        // Convert to blob
        webgl_renderer.domElement.toBlob(blob => resolve({ blob, dataUrl }))
    })
}