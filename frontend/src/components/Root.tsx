import * as React from 'react'
import * as ReactHelmet from 'react-helmet'
import { Scene, PerspectiveCamera, WebGLRenderer, PointLight, AmbientLight, sRGBEncoding, Group } from 'three'
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default class Root extends React.Component {
    private main: React.RefObject<HTMLElement>

    private loader: GLTFLoader
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

    constructor(props: {}) {
        super(props)
        // Create
        this.main = React.createRef()
        // Bind
        this.resize = this.resize.bind(this)
        this.paint = this.paint.bind(this)
    }
    
    async componentDidMount() {
        // Loader
        this.loader = new GLTFLoader()
        // Model
        this.model = await this.loader.loadAsync('/models/avocado.glb')
        this.model.scene.position.y = 1.6
        this.model.scene.position.z = -1
        // Ambient light
        this.ambient_light = new AmbientLight(0xffffff, 0.5)
        // Point light
        this.point_light = new PointLight(0xffffff, 1, 100)
        this.point_light.position.set(50,50,50)
        // Factory
        const factory = new XRControllerModelFactory()
        // Renderer
        this.renderer = new WebGLRenderer({ antialias: true })
        this.renderer.xr.enabled = true
        this.renderer.outputEncoding = sRGBEncoding
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.main.current.offsetWidth, this.main.current.offsetHeight)
        this.renderer.setClearColor(0x888888)
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
        this.grip1.add(factory.createControllerModel(this.grip1))
        // Controller grip 2
        this.grip2 = this.renderer.xr.getControllerGrip(1)
        this.grip2.add(factory.createControllerModel(this.grip2))
        // Scene
        this.scene = new Scene()
        this.scene.add(this.model.scene)
        //this.scene.add(this.mesh)
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
        // Div
        this.main.current.appendChild(this.renderer.domElement)
        this.main.current.appendChild(VRButton.createButton(this.renderer))
        // Add
        window.addEventListener('resize', this.resize)
        // Resize
        setTimeout(this.resize, 100)
    }
    
    componentWillUnmount() {
        // Frame
        this.renderer.setAnimationLoop(null)
        // Resize
        window.removeEventListener('resize', this.resize)
    }

    resize() {
        // Camera
        this.camera.aspect = this.main.current.offsetWidth / this.main.current.offsetHeight
        this.camera.updateProjectionMatrix()
        // Renderer
        this.renderer.setSize(this.main.current.offsetWidth, this.main.current.offsetHeight)
    }

    paint() {
        // Rotate
        this.model.scene.rotation.x += 0.01
        this.model.scene.rotation.y += 0.01
        // Render
        this.renderer.render(this.scene, this.camera)
    }
    
    render() {
        return (
            <React.Fragment>
                <ReactHelmet.Helmet>
                    <title>FH OÖ Audit Platform Frontend</title>
                    <link rel="icon" href="/images/icon.png"/>
                    <link rel="stylesheet" href="/styles/main.css"/>
                </ReactHelmet.Helmet>
                <header>
                    FH OÖ Audit Platform
                </header>
                <main ref={this.main}>

                </main>
            </React.Fragment>
        )
    }
}