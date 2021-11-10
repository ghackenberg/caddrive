import * as React from 'react'
import { Scene, PerspectiveCamera, WebGLRenderer, PointLight, AmbientLight, sRGBEncoding, Group, Object3D, Raycaster, Vector2, Mesh, Material, MeshStandardMaterial } from 'three'
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

export class SceneView extends React.Component<{ model: GLTF, mouse: boolean, vr: boolean }> {

    private div: React.RefObject<HTMLDivElement>

    private factory = new XRControllerModelFactory()
    private ambient_light: AmbientLight
    private point_light: PointLight
    private renderer: WebGLRenderer
    private raycaster: Raycaster
    private selected: Object3D
    private controller1: Group
    private controller2: Group
    private grip1: Group
    private grip2: Group
    private scene: Scene
    private camera: PerspectiveCamera
    private button: HTMLElement

    private fullscreen = false

    constructor(props: { model: GLTF, mouse: boolean, vr: boolean }) {
        super(props)
        // Create
        this.div = React.createRef()
        // Bind
        this.resize = this.resize.bind(this)
        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
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
        // Raycaster
        this.raycaster = new Raycaster()
        // Button
        if (this.props.vr) {
            this.button = VRButton.createButton(this.renderer)
            this.button.addEventListener('click', () => {
                this.fullscreen = !this.fullscreen
                this.resize()
            })
        }
        // Append
        this.div.current.appendChild(this.renderer.domElement)
        if (this.props.vr) {
            this.div.current.appendChild(this.button)
        }
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

    normalizeMousePosition(event: React.MouseEvent) {
        var x = event.clientX
        var y = event.clientY

        var i: HTMLElement = this.div.current

        while (i) {
            x -= i.offsetLeft
            y -= i.offsetTop

            i = i.offsetParent as HTMLElement
        }

        const w = this.div.current.offsetWidth
        const h = this.div.current.offsetHeight

        return new Vector2(x / w * 2 - 1, - y / h * 2 + 1)
    }

    updateIntersection(event: React.MouseEvent) {
        if (this.props.mouse) {
            if (this.selected) {
                if (this.selected.type == 'Mesh') {
                    const mesh = this.selected as Mesh
                    if (typeof mesh.material == 'object') {
                        const material = mesh.material as Material
                        if (material.type == 'MeshStandardMaterial') {
                            const msm = material as MeshStandardMaterial
                            msm.emissive.setScalar(0)
                        } else {
                            console.error('Material type not supported', material.type)
                        }
                    } else {
                        console.error('Material type not supported', typeof mesh.material)
                    }
                } else {
                    console.error('Object type not supported', this.selected.type)
                }
            }
            
            this.raycaster.setFromCamera(this.normalizeMousePosition(event), this.camera)
            
            const intersections = this.raycaster.intersectObjects(this.scene.children, true)

            if (intersections.length > 0) {
                this.selected = intersections[0].object
                if (this.selected.type == 'Mesh') {
                    const mesh = this.selected as Mesh
                    if (typeof mesh.material == 'object') {
                        const material = mesh.material as Material
                        if (material.type == 'MeshStandardMaterial') {
                            const msm = material as MeshStandardMaterial
                            msm.emissive.setScalar(0.1)
                        } else {
                            console.error('Material type not supported', material.type)
                        }
                    } else {
                        console.error('Material type not supported', typeof mesh.material)
                    }
                } else {
                    console.error('Object type not supported', this.selected.type)
                }
                this.div.current.title = this.selected.name
                this.div.current.style.cursor = 'pointer'
            } else {
                this.div.current.title = ''
                this.div.current.style.cursor = 'default'
            }
        }
    }

    handleMouseEnter(event: React.MouseEvent) {
        this.updateIntersection(event)
    }

    handleMouseMove(event: React.MouseEvent) {
        this.updateIntersection(event)
    }
    
    handleClick(event: React.MouseEvent) {
        this.updateIntersection(event)
        if (this.selected) {
            var path = this.selected.name
            var iterator = this.selected.parent
            while (iterator) {
                path = `${iterator.name || iterator.type} / ${path}`
                iterator = iterator.parent
            }
            alert(path)
        }
    }

    handleMouseLeave(event: React.MouseEvent) {
        this.updateIntersection(event)
    }

    paint() {
        // Render
        if (this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera)
        }
    }
    
    override render() {
        return <div className="widget scene_view" onMouseEnter={this.handleMouseEnter} onMouseMove={this.handleMouseMove} onMouseLeave={this.handleMouseLeave} onClick={this.handleClick} ref={this.div}/>
    }
    
}