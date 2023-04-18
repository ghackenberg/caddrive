import { ACESFilmicToneMapping, AmbientLight, Box3, DirectionalLight, Group, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer, sRGBEncoding } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Ambient light
export const ambient_light = new AmbientLight(0xffffff, 0.5)
// Directional light
export const directional_light = new DirectionalLight(0xffffff, 1)

// Scene
const scene = new Scene()
scene.add(ambient_light)
scene.add(directional_light)
scene.add(new Object3D())

// Camera
const camera = new PerspectiveCamera(45, 1, 0.1, 1000)

// WebGL renderer
const renderer = new WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.outputEncoding = sRGBEncoding
renderer.toneMapping = ACESFilmicToneMapping
//renderer.setPixelRatio(window.devicePixelRatio)

// Orbit
const orbit = new OrbitControls(camera, renderer.domElement)

export function prepare(model: Group, orbit: OrbitControls) {
    // Analyze
    const box = new Box3().setFromObject(model)
    const center = box.getCenter(new Vector3())
    const size = box.getSize(new Vector3())
    const radius = Math.max(size.x, Math.max(size.y, size.z)) * 0.75

    // Orbit
    orbit.target0.copy(center)
    orbit.position0.set(-2.3, 1, 2).multiplyScalar(radius).add(center)
    orbit.reset()
}

export function render(model: Group, width: number, height: number): Promise<{ blob: Blob, dataUrl: string }> {
    return new Promise<{ blob: Blob, dataUrl: string }>(resolve => {
        // Scene
        scene.remove(scene.children[scene.children.length - 1])
        scene.add(model)

        // Camera
        camera.aspect = width / height

        // Prepare
        prepare(model, orbit)

        // Renderer
        renderer.setSize(width, height)
        renderer.render(scene, camera)

        // Convert to data URL
        const dataUrl = renderer.domElement.toDataURL()
        // Convert to blob
        renderer.domElement.toBlob(blob => resolve({ blob, dataUrl }))
    })
}