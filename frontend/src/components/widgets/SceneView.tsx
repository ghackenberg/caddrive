import * as React from 'react'
import { Scene, PerspectiveCamera, WebGLRenderer, PointLight, AmbientLight, sRGBEncoding, Group } from 'three'
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export class SceneView extends React.Component<{ url: string }> {
    private main: React.RefObject<HTMLElement>

    private loader = new GLTFLoader()
    private factory = new XRControllerModelFactory()
    private model: GLTF
    private ambient_light: AmbientLight
    private point_light: PointLight
    private renderer: WebGLRenderer
    private controller1: Group
    private controller2: Group
    private grip1: Group
    private grip2: Group
    private scene: Scene
    private camera: PerspectiveCamera
    private button: HTMLElement

    private fullscreen = false

    constructor(props: { url: string }) {
        super(props)
        // Create
        this.main = React.createRef()
        // Bind
        this.resize = this.resize.bind(this)
        this.paint = this.paint.bind(this)
    }

    async componentDidUpdate() {
        await this.reload()
    }
    
    async componentDidMount() {
        // Ambient light
        this.ambient_light = new AmbientLight(0xffffff, 0.5)
        // Point light
        this.point_light = new PointLight(0xffffff, 1, 100)
        this.point_light.position.set(50,50,50)
        // Renderer
        this.renderer = new WebGLRenderer({ antialias: true })
        this.renderer.xr.enabled = true
        this.renderer.outputEncoding = sRGBEncoding
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.main.current.offsetWidth, this.main.current.offsetHeight)
        this.renderer.setClearColor(0xeeeeee)
        this.renderer.setAnimationLoop(this.paint)
        // Controller 1
        this.controller1 = this.renderer.xr.getController(0)
        this.controller1.addEventListener('selectstart', console.log)
        this.controller1.addEventListener('selectend', console.log)
        this.controller1.addEventListener('connected', console.log)
        this.controller1.addEventListener('disconnected', console.log)
        // Controller 2
        this.controller2 = this.renderer.xr.getController(1)
        this.controller2.addEventListener('selectstart', console.log)
        this.controller2.addEventListener('selectend', console.log)
        this.controller2.addEventListener('connected', console.log)
        this.controller2.addEventListener('disconnected', console.log)
        // Controller grip 1
        this.grip1 = this.renderer.xr.getControllerGrip(0)
        this.grip1.add(this.factory.createControllerModel(this.grip1))
        // Controller grip 2
        this.grip2 = this.renderer.xr.getControllerGrip(1)
        this.grip2.add(this.factory.createControllerModel(this.grip2))
        // Scene
        this.scene = new Scene()
        this.scene.add(this.ambient_light)
        this.scene.add(this.point_light)
        this.scene.add(this.controller1)
        this.scene.add(this.controller2)
        this.scene.add(this.grip1)
        this.scene.add(this.grip2)
        // Camera
        this.camera = new PerspectiveCamera(3, this.main.current.offsetWidth / this.main.current.offsetHeight, 0.1, 1000)
        this.camera.position.y = 1.6
        this.camera.position.z = 5       
        // Button
        this.button = VRButton.createButton(this.renderer)
        this.button.addEventListener('click', event => {
            this.fullscreen = !this.fullscreen
            this.resize()
        })
        // Append
        this.main.current.appendChild(this.renderer.domElement)
        this.main.current.appendChild(this.button)
        // Listen
        window.addEventListener('resize', this.resize)
        // Resize
        setTimeout(this.resize, 100)
        // Reload
        await this.reload()
    }
    
    componentWillUnmount() {
        // Frame
        this.renderer.setAnimationLoop(null)
        // Resize
        window.removeEventListener('resize', this.resize)
    }

    async reload() {
        if (this.model) {
            this.scene.remove(this.model.scene)
        }
        // Model
        this.model = await this.loader.loadAsync(this.props.url)
        // Scene
        this.scene.add(this.model.scene)
        // Camera
        if (this.model.cameras.length > 0 && this.model.cameras[0] instanceof PerspectiveCamera) {
            this.camera = this.model.cameras[0] as PerspectiveCamera
            this.resize()
        }
    }

    resize() {
        const width = this.fullscreen ? window.innerWidth : this.main.current.offsetWidth
        const height = this.fullscreen ? window.innerHeight : this.main.current.offsetHeight
        // Camera
        if (this.camera) {
            this.camera.aspect = width / height
            this.camera.updateProjectionMatrix()           
        }
        // Renderer
        this.renderer.setSize(width, height)
    }

    paint() {
        // Render
        if (this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera)
        }
    }
    
    render() {
        return (
            <React.Fragment>
                <Header/>
                <Navigation/>
                <main ref={this.main} style={{padding: '0'}}>

                </main>
            </React.Fragment>
        )
    }
}