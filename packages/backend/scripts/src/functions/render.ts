import gl from 'gl'
import Jimp from 'jimp'
import { ACESFilmicToneMapping, AmbientLight, Box3, DirectionalLight, Group, LoadingManager, Object3D, PerspectiveCamera, Scene, Vector3, WebGLRenderer, sRGBEncoding } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { LDrawLoader } from 'three/examples/jsm/loaders/LDrawLoader'

function initializeScene() {
    const ambient_light = new AmbientLight(0xffffff, 0.5)
    const directional_light = new DirectionalLight(0xffffff, 1)

    const scene = new Scene()
    scene.add(ambient_light)
    scene.add(directional_light)
    scene.add(new Object3D())

    return scene
}

function initializeCamera(aspect = 1, near = 1, far = 1) {
    const camera = new PerspectiveCamera(45, aspect, near, far)

    return camera
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function initializeCanvas(context: any, width = 1, height = 1) {
    return {
        width,
        height,
        style: {
            touchAction: 'none'
        },
        getContext: () => {
            return context
        },
        addEventListener: () => {
            // empty
        },
        removeEventListener: () => {
            // empty
        },
    }
}

function initializeContext(width = 1, height = 1) {
    return gl(width, height, { preserveDrawingBuffer: true })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function initializeRenderer(canvas: any, context: any) {
    const antialias = true
    const alpha = true
    const logarithmicDepthBuffer = true
    
    const renderer = new WebGLRenderer({ antialias, alpha, logarithmicDepthBuffer, canvas, context })
    renderer.outputEncoding = sRGBEncoding
    renderer.toneMapping = ACESFilmicToneMapping

    return renderer
}

function initializeOrbit(camera: PerspectiveCamera, renderer: WebGLRenderer) {
    const orbit = new OrbitControls(camera, renderer.domElement)

    return orbit
}

function reset(model: Group, camera: PerspectiveCamera, orbit: OrbitControls) {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TASKS: { model: Group, width: number, height: number, resolve: (value: Jimp) => void, reject: (reason?: any) => void }[] = []

let THREAD: NodeJS.Timeout

function renderNext() {
    const { model, width, height, resolve, reject } = TASKS.pop()

    // Scene
    const scene = initializeScene()
    scene.remove(scene.children[scene.children.length - 1])
    scene.add(model)

    // Camera
    const camera = initializeCamera()
    camera.aspect = width / height

    // Context
    const context = initializeContext(width, height)

    // Canvas
    const canvas = initializeCanvas(context, width, height)

    // Renderer
    const renderer = initializeRenderer(canvas, context)

    // Orbit
    const orbit = initializeOrbit(camera, renderer)

    // Prepare
    reset(model, camera, orbit)

    // Renderer
    renderer.render(scene, camera)

    // Write buffer
    const buffer = new Uint8Array(width * height * 4)
    context.readPixels(0, 0, width, height, context.RGBA, context.UNSIGNED_BYTE, buffer)

    // Destroy context
    context.getExtension('STACKGL_destroy_context').destroy()

    // Write image
    new Jimp(width, height, (error, image) => {
        if (TASKS.length > 0) {
            THREAD = setTimeout(renderNext, 0)
        } else {
            THREAD = null
        }
        if (error) {
            reject(error)
        } else {
            const data = image.bitmap.data
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    const bufferOffset = y * width * 4 + x * 4
                    const dataOffset = (height - y - 1) * width * 4 + x * 4
                    data[dataOffset + 0] = buffer[bufferOffset + 0]
                    data[dataOffset + 1] = buffer[bufferOffset + 1]
                    data[dataOffset + 2] = buffer[bufferOffset + 2]
                    data[dataOffset + 3] = buffer[bufferOffset + 3]
                }
            }
            resolve(image)
        }
    })
}

function render(model: Group, width: number, height: number): Promise<Jimp> {
    return new Promise<Jimp>((resolve, reject) => {
        TASKS.push({ model, width, height, resolve, reject })
        if (!THREAD) {
            THREAD = setTimeout(renderNext, 0)
        }
    })
}

const LOADING_MANAGER = new LoadingManager()

LOADING_MANAGER.setURLModifier(url => {
    if (url.indexOf('/') == -1) {
        return `http://localhost:3001/rest/parts/${url}`
    } else {
        return `http://localhost:3001/rest/parts/${url.substring(url.lastIndexOf('/') + 1)}`
    }
})

let LDRAW_MATERIALS = false

const LDRAW_LOADER = new LDrawLoader(LOADING_MANAGER)

export async function renderLDraw(model: string, width: number, height: number) {
    if (!LDRAW_MATERIALS) {
        await LDRAW_LOADER.preloadMaterials('LDConfig.ldr')
        LDRAW_MATERIALS = true
    }
    return new Promise<Jimp>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (LDRAW_LOADER as any).parse(model, (group: Group) => {
            // Fix coordinates
            group.rotation.x = Math.PI
            // Render and resolve/reject
            render(group, width, height).then(resolve).catch(reject)
        })
    })
}

const GLTF_LOADER = new GLTFLoader()

export async function renderGlb(buffer: Buffer, width: number, height: number) {
    const array = new ArrayBuffer(buffer.length)
    const view = new Uint8Array(array)
    for (let i = 0; i < buffer.length; i++) {
        view[i] = buffer[i]
    }
    return new Promise<Jimp>((resolve, reject) => {
        GLTF_LOADER.parse(array, undefined, model => {
            render(model.scene, width, height).then(resolve).catch(reject)
        }, error => {
            reject(error)
        })
    })
}