import { ACESFilmicToneMapping, AmbientLight, Box3, DirectionalLight, Group, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer, XRAnimationLoopCallback, sRGBEncoding } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = initializeScene()
const camera = initializeCamera()
const renderer = initializeRenderer()
const orbit = initializeOrbit(camera, renderer)

export function initializeScene() {
    const ambient_light = new AmbientLight(0xffffff, 0.5)
    const directional_light = new DirectionalLight(0xffffff, 1)

    const scene = new Scene()
    scene.add(ambient_light)
    scene.add(directional_light)
    scene.add(new Object3D())

    return scene
}

export function initializeCamera(aspect = 1, near = 1, far = 1) {
    const camera = new PerspectiveCamera(45, aspect, near, far)

    return camera
}

export function initializeRenderer(width = 1, height = 1, loop: XRAnimationLoopCallback = undefined) {
    const renderer = new WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
    renderer.outputEncoding = sRGBEncoding
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(width, height)
    renderer.setAnimationLoop(loop)

    return renderer
}

export function initializeOrbit(camera: PerspectiveCamera, renderer: WebGLRenderer) {
    const orbit = new OrbitControls(camera, renderer.domElement)
    orbit.enableDamping = true

    return orbit
}

export function reset(model: Group, camera: PerspectiveCamera, orbit: OrbitControls) {
    // Analyze
    const box = new Box3().setFromObject(model)
    const center = box.getCenter(new Vector3())
    const size = box.getSize(new Vector3())
    const radius = Math.max(size.x, Math.max(size.y, size.z)) * 0.75

    // Camera
    camera.near = radius * 0.01
    camera.far = radius * 100

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
        reset(model, camera, orbit)

        // Renderer
        renderer.setSize(width, height)
        renderer.render(scene, camera)

        // Convert to data URL
        const dataUrl = renderer.domElement.toDataURL()
        // Convert to blob
        renderer.domElement.toBlob(blob => resolve({ blob, dataUrl }))
    })
}