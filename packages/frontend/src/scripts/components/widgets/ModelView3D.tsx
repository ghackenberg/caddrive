import * as React from 'react'

import { Scene, PerspectiveCamera, WebGLRenderer, AmbientLight, sRGBEncoding, Group, Object3D, Raycaster, Vector2, Mesh, Material, MeshStandardMaterial, DirectionalLight } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory'

import { createCamera } from '../../functions/render'

interface Props {
    model: GLTF
    highlighted?: string[]
    marked?: string[]
    selected?: string[]
    mouse: boolean
    vr: boolean
    click?: (object: Object3D) => void
    frame?: (image: Blob) => void
}

export class ModelView3D extends React.Component<Props> {

    private div: React.RefObject<HTMLDivElement>
    private timeout: NodeJS.Timeout

    private factory = new XRControllerModelFactory()
    private ambient_light: AmbientLight
    private directional_light: DirectionalLight
    private renderer: WebGLRenderer
    private orbit: OrbitControls
    private raycaster: Raycaster
    private controller1: Group
    private controller2: Group
    private grip1: Group
    private grip2: Group
    private scene: Scene
    private camera: PerspectiveCamera
    private button: HTMLElement

    private position_start: {clientX: number, clientY: number}
    private position_end: {clientX: number, clientY: number}
    
    private hovered: Object3D
    private selected: Object3D

    private fullscreen = false

    constructor(props: Props) {
        super(props)
        // Create
        this.div = React.createRef()
        // Bind
        this.resize = this.resize.bind(this)

        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)

        this.handleTouchStart = this.handleTouchStart.bind(this)
        this.handleTouchMove = this.handleTouchMove.bind(this)
        this.handleTouchEnd = this.handleTouchEnd.bind(this)

        this.paint = this.paint.bind(this)
    }

    override componentDidUpdate() {
        this.reload()
    }
    
    override componentDidMount() {
        // Ambient light
        this.ambient_light = new AmbientLight(0xffffff, 0.5)
        // Directional light
        this.directional_light = new DirectionalLight(0xffffff, 1)
        // Renderer
        this.renderer = new WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true, alpha: true })
        this.renderer.xr.enabled = true
        this.renderer.outputEncoding = sRGBEncoding
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.div.current.offsetWidth, this.div.current.offsetHeight)
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
        this.scene.add(this.directional_light)
        this.scene.add(this.controller1)
        this.scene.add(this.controller2)
        this.scene.add(this.grip1)
        this.scene.add(this.grip2)
        this.scene.add(new Object3D())
        // Camera
        this.camera = new PerspectiveCamera(3, this.div.current.offsetWidth / this.div.current.offsetHeight, 0.1, 1000)
        this.camera.position.z = 5
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
        // Raycaster
        this.raycaster = new Raycaster()
        // Orbit
        this.orbit = this.props.mouse && new OrbitControls(this.camera, this.renderer.domElement)
        // Listen
        window.addEventListener('resize', this.resize)
        // Resize
        this.timeout = setTimeout(() => {
            // Reset
            this.timeout = undefined
            // Call
            this.resize()
        }, 100)
        // Reload
        this.reload()
    }
    
    override componentWillUnmount() {
        // Frame
        this.renderer.setAnimationLoop(null)
        // Resize
        window.removeEventListener('resize', this.resize)
        // Timeout
        if (this.timeout) {
            // Clear
            clearTimeout(this.timeout)
            // Reset
            this.timeout = undefined
        }
        // Remove all active WebGl contexts
        while(this.div.current.childElementCount > 0) {
            this.div.current.removeChild(this.div.current.lastChild)
        }
        // Revert material
        if (this.select_cache) {
            this.revertSelect(this.scene)
            this.select_cache = undefined
        }
        if (this.highlight_cache) {
            this.revertHighlight(this.scene)
            this.highlight_cache = undefined
        }
    }

    private highlight_cache: {[uuid: string]: Material | Material[]}

    setHighlight(object: Object3D) {
        // Process object
        if (object.type == 'Mesh') {
            const mesh = object as Mesh
            this.highlight_cache[mesh.uuid] = mesh.material
            const highlighted = this.props.highlighted.indexOf(object.name) != -1
            const marked = this.props.marked.indexOf(object.name) != -1
            if (highlighted && marked) {
                mesh.material = new MeshStandardMaterial({
                    color: 0x0000ff
                })
            } else if (highlighted) {
                mesh.material = new MeshStandardMaterial({
                    color: 0xff0000
                })
            } else if (marked) {
                mesh.material = new MeshStandardMaterial({
                    color: 0x00ff00
                })
            } else {
                mesh.material = new MeshStandardMaterial({
                    color: 0xffffff, transparent: true, opacity: 0.25
                })
            }
        }
        // Process children
        for (const child of object.children) {
            this.setHighlight(child)
        }
    }

    revertHighlight(object: Object3D) {
        // Process object
        if (object.type == 'Mesh') {
            const mesh = object as Mesh
            mesh.material = this.highlight_cache[mesh.uuid]
        }
        // Process children
        for (const child of object.children) {
            this.revertHighlight(child)
        }
    }

    private select_cache: {[uuid: string]: Material | Material[]}

    setSelect(object: Object3D) {
        if (object.type == 'Mesh') {
            const mesh = object as Mesh
            this.select_cache[mesh.uuid] = mesh.material
            if (this.props.selected.indexOf(mesh.name) != -1) {
                if (Array.isArray(mesh.material)) {
                    const array: Material[] = []
                    for (const material of mesh.material) {
                        const copy = material.clone()
                        if (copy instanceof MeshStandardMaterial) {
                            const standard = copy as MeshStandardMaterial
                            standard.emissive.setScalar(0.1)
                        }
                        array.push(copy)
                    }
                    mesh.material = array
                } else {
                    const copy = mesh.material.clone()
                    if (copy instanceof MeshStandardMaterial) {
                        const standard = copy as MeshStandardMaterial
                        standard.emissive.setScalar(0.1)
                    }
                    mesh.material = copy
                }
            }
        }
        for (const child of object.children) {
            this.setSelect(child)
        }
    }

    revertSelect(object: Object3D) {
        if (object.type == 'Mesh') {
            const mesh = object as Mesh
            mesh.material = this.select_cache[mesh.uuid]
        }
        for (const child of object.children) {
            this.revertSelect(child)
        }
    }

    reload() {
        if (this.scene.children.length == 0 || this.scene.children[this.scene.children.length - 1] != this.props.model.scene) {
            // Cache
            this.highlight_cache = undefined
            this.select_cache = undefined
            // Scene
            this.scene.remove(this.scene.children[this.scene.children.length - 1])
            this.scene.add(this.props.model.scene)
            // Camera
            this.camera = createCamera(this.props.model.scene, this.div.current.offsetWidth, this.div.current.offsetHeight)
            // Orbit
            if (this.props.mouse) {
                this.orbit.object = this.camera
                this.orbit.update()
            }
        }
        // Highlight and select
        if (this.select_cache) {
            this.revertSelect(this.scene)
            this.select_cache = undefined
        }
        if (this.highlight_cache) {
            this.revertHighlight(this.scene)
            this.highlight_cache = undefined
        }
        if ((this.props.highlighted && this.props.highlighted.length > 0) || (this.props.marked && this.props.marked.length > 0)) {
            this.highlight_cache = {}
            this.setHighlight(this.scene)
        }
        if (this.props.selected && this.props.selected.length > 0) {
            this.select_cache = {}
            this.setSelect(this.scene)
        }
        // Resize
        this.resize()
    }

    resize() {
        if (this.div.current) {
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
    }

    normalizeMousePosition(position: { clientX: number, clientY: number }) {
        let x = position.clientX
        let y = position.clientY

        let i: HTMLElement = this.div.current

        while (i) {
            x -= i.offsetLeft
            y -= i.offsetTop

            i = i.offsetParent as HTMLElement
        }

        const w = this.div.current.offsetWidth
        const h = this.div.current.offsetHeight

        return new Vector2(x / w * 2 - 1, - y / h * 2 + 1)
    }

    updateMaterial(object: Object3D, scalar: number) {
        if (object.type == 'Mesh') {
            const mesh = object as Mesh
            if (typeof mesh.material == 'object') {
                const material = mesh.material as Material
                if (material.type == 'MeshStandardMaterial') {
                    const msm = material as MeshStandardMaterial
                    msm.emissive.setScalar(scalar)
                } else {
                    console.error('Material type not supported', material.type)
                }
            } else {
                console.error('Material type not supported', typeof mesh.material)
            }
        } else {
            console.error('Object type not supported', object.type)
        }
    }

    updateHovered(position: { clientX: number, clientY: number }) {
        if (this.props.mouse) {
            if (this.hovered && this.hovered != this.selected) {
                this.updateMaterial(this.hovered, 0)
                this.hovered = null
            }
            
            this.raycaster.setFromCamera(this.normalizeMousePosition(position), this.camera)
            const intersections = this.raycaster.intersectObjects(this.scene.children, true)

            if (intersections.length > 0) {
                this.hovered = intersections[0].object
                this.updateMaterial(this.hovered, 0.1)
                this.div.current.title = this.hovered.name
                this.div.current.style.cursor = 'pointer'
            } else {
                this.div.current.title = ''
                this.div.current.style.cursor = 'default'
            }
        }
    }

    updateSelected(position: { clientX: number, clientY: number }) {
        this.updateHovered(position)
        if (this.selected && this.selected != this.hovered) {
            this.updateMaterial(this.selected, 0)
            this.selected = null
        }
        if (this.hovered) {
            if (this.props.click) {
                this.selected = this.hovered
                this.updateMaterial(this.selected, 0.2)
                this.props.click(this.selected)
            }
        }
    }

    calculateDistance() {
        if (this.position_start && this.position_end) {
            const dx = this.position_start.clientX - this.position_end.clientX
            const dy = this.position_start.clientY - this.position_end.clientY
            return Math.sqrt(dx * dx + dy * dy)
        } else {
            return 0
        }
    }

    handleMouseDown(event: React.MouseEvent) {
        this.position_start = event
        this.position_end = event
    }

    handleMouseMove(event: React.MouseEvent) {
        if (this.position_start && this.position_end) {
            this.position_end = event
        } else {
            this.updateHovered(event)
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleMouseUp(_event: React.MouseEvent) {
        if (this.position_start && this.position_end) {
            if (this.calculateDistance() <= 1) {
                 this.updateSelected(this.position_end)
            }
            this.position_start = null
            this.position_end = null
        }
    }

    handleTouchStart(event: React.TouchEvent) {
        this.position_start = event.touches[0]
        this.position_end = event.touches[0]
    }

    handleTouchMove(event: React.TouchEvent) {
        this.position_end = event.touches[0]
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleTouchEnd(_event: React.TouchEvent) {
        if (this.calculateDistance() <= 1) {
            this.updateSelected(this.position_end)
        }
        this.position_start = null
        this.position_end = null
    }

    paint() {
        // Render
        if (this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera)
            if (this.props.frame) {
                const canvas: HTMLCanvasElement = this.div.current.childNodes[0] as HTMLCanvasElement         
                canvas.toBlob(this.props.frame)
            }
            
        }
    }
    
    override render() {
        return <div className="widget model_view_3d" onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp} onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd} ref={this.div}/>
        
    }
    
}