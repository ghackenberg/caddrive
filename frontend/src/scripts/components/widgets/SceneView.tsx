import * as React from 'react'
import { Scene, PerspectiveCamera, WebGLRenderer, PointLight, AmbientLight, sRGBEncoding, Group, Object3D } from 'three'
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

export class SceneView extends React.Component<{ model: GLTF }> {
    private div: React.RefObject<HTMLDivElement>

    private factory = new XRControllerModelFactory()
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

    constructor(props: { model: GLTF }) {
        super(props)
        // Create
        this.div = React.createRef()
        // Bind
        this.resize = this.resize.bind(this)
        this.paint = this.paint.bind(this)
    }

    override async componentDidUpdate() {
        await this.reload()
    }
    
    override async componentDidMount() {
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
        this.renderer.setSize(this.div.current.offsetWidth, this.div.current.offsetHeight)
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
        this.scene.add(new Object3D())
        // Camera
        this.camera = new PerspectiveCamera(3, this.div.current.offsetWidth / this.div.current.offsetHeight, 0.1, 1000)
        this.camera.position.z = 5
        // Button
        this.button = VRButton.createButton(this.renderer)
        this.button.addEventListener('click', () => {
            this.fullscreen = !this.fullscreen
            this.resize()
        })
        // Append
        this.div.current.appendChild(this.renderer.domElement)
        this.div.current.appendChild(this.button)
        // Listen
        window.addEventListener('resize', this.resize)
        // Resize
        setTimeout(this.resize, 100)
        // Reload
        await this.reload()
    }
    
    override componentWillUnmount() {
        // Frame
        this.renderer.setAnimationLoop(null)
        // Resize
        window.removeEventListener('resize', this.resize)
    }

    async reload() {
        // Scene
        this.scene.remove(this.scene.children[this.scene.children.length - 1])
        this.scene.add(this.props.model.scene)
        // Camera
        if (this.props.model.cameras.length > 0 && this.props.model.cameras[0] instanceof PerspectiveCamera) {
            this.camera = this.props.model.cameras[0] as PerspectiveCamera
        } else {
            this.camera = new PerspectiveCamera(3, this.div.current.offsetWidth / this.div.current.offsetHeight, 0.1, 1000)
            this.camera.position.z = 5
        }
        // Resize
        this.resize()
    }

    resize() {
        const width = this.fullscreen ? window.innerWidth : this.div.current.offsetWidth
        const height = this.fullscreen ? window.innerHeight : this.div.current.offsetHeight
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
    
    override render() {
        return <div className="widget scene_view" ref={this.div}/>
    }
}