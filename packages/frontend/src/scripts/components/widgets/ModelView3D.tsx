import * as React from 'react'

import { Scene, PerspectiveCamera, WebGLRenderer, Group, Object3D, Raycaster, Vector2, Mesh, Material, MeshStandardMaterial, Vector3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { comparePath } from '../../functions/path'
import { initializeCamera, initializeOrbit, initializeRenderer, initializeScene, reset } from '../../functions/render'

interface Props {
    model: Group
    update?: number
    highlighted?: string[]
    marked?: string[]
    selected?: string[]
    over?: (object: Object3D) => void
    out?: (object: Object3D) => void
    click?: (object: Object3D) => void
    drop?: (event: React.DragEvent, pos: Vector3) => void
}

export class ModelView3D extends React.Component<Props> {

    private div: React.RefObject<HTMLDivElement>

    private update: number
    private scene: Scene
    private camera: PerspectiveCamera
    private renderer: WebGLRenderer
    private orbit: OrbitControls
    private raycaster: Raycaster

    private position_start: {clientX: number, clientY: number}
    private position_end: {clientX: number, clientY: number}
    
    private hovered: Object3D

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

        this.handleDragEnter = this.handleDragEnter.bind(this)
        this.handleDragOver = this.handleDragOver.bind(this)
        this.handleDragLeave = this.handleDragLeave.bind(this)
        this.handleDrop = this.handleDrop.bind(this)

        this.paint = this.paint.bind(this)
    }
    
    override componentDidMount() {
        // Scene
        this.scene = initializeScene()
        // Camera
        this.camera = initializeCamera(this.div.current.offsetWidth / this.div.current.offsetHeight)
        // Renderer
        this.renderer = initializeRenderer(this.div.current.offsetWidth, this.div.current.offsetHeight, this.paint)
        // Orbit
        this.orbit = initializeOrbit(this.camera, this.renderer)
        // Raycaster
        this.raycaster = new Raycaster()
        // Append
        this.div.current.appendChild(this.renderer.domElement)
        // Listen
        window.addEventListener('resize', this.resize)
        // Reload
        this.reload()
    }

    override componentDidUpdate() {
        this.reload()
    }
    
    override componentWillUnmount() {
        // Frame
        this.renderer.setAnimationLoop(null)
        this.renderer.forceContextLoss()
        // Resize
        window.removeEventListener('resize', this.resize)
        // Remove all active WebGl contexts
        while(this.div.current.childElementCount > 0) {
            this.div.current.removeChild(this.div.current.lastChild)
        }
        // Revert material
        if (this.select_cache) {
            this.revertSelect(this.props.model)
            this.select_cache = undefined
        }
        if (this.highlight_cache) {
            this.revertHighlight(this.props.model)
            this.highlight_cache = undefined
        }
    }

    private highlight_cache: {[uuid: string]: Material | Material[]}

    setHighlight(object: Object3D, path = '0') {
        // Process object
        if (object.type == 'Mesh') {
            const mesh = object as Mesh
            this.highlight_cache[mesh.uuid] = mesh.material
            const highlighted = this.props.highlighted.filter(prefix => comparePath(prefix, path)).length > 0
            const marked = this.props.marked.filter(prefix => comparePath(prefix, path)).length > 0
            if (mesh.material instanceof MeshStandardMaterial && !mesh.material.wireframe) {
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
        }
        // Process children
        for (let index = 0; index < object.children.length; index++) {
            const child = object.children[index]
            this.setHighlight(child, `${path}-${index}`)
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

    setSelect(object: Object3D, path = '0') {
        if (object.type == 'Mesh') {
            const mesh = object as Mesh
            this.select_cache[mesh.uuid] = mesh.material
            if (this.props.selected.filter(prefix => comparePath(prefix, path)).length > 0) {
                if (Array.isArray(mesh.material)) {
                    const array: Material[] = []
                    for (const material of mesh.material) {
                        const copy = material.clone()
                        if (copy instanceof MeshStandardMaterial) {
                            const standard = copy as MeshStandardMaterial
                            if (!standard.wireframe) {
                                standard.emissive.setScalar(0.1)
                            }
                        }
                        array.push(copy)
                    }
                    mesh.material = array
                } else {
                    const copy = mesh.material.clone()
                    if (copy instanceof MeshStandardMaterial) {
                        const standard = copy as MeshStandardMaterial
                        if (!standard.wireframe) {
                            standard.emissive.setScalar(0.1)
                        }
                    }
                    mesh.material = copy
                }
            }
        }
        for (let index = 0; index < object.children.length; index++) {
            const child = object.children[index]
            this.setSelect(child, `${path}-${index}`)
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
        // Reverting highlight and select
        if (this.select_cache) {
            this.revertSelect(this.scene.children[this.scene.children.length - 1])
            this.select_cache = undefined
        }
        if (this.highlight_cache) {
            this.revertHighlight(this.scene.children[this.scene.children.length - 1])
            this.highlight_cache = undefined
        }
        // Updating scene
        if (this.scene.children.length == 0 || this.scene.children[this.scene.children.length - 1] != this.props.model || this.update != this.props.update) {
            // Update
            this.update = this.props.update
            // Scene
            this.scene.remove(this.scene.children[this.scene.children.length - 1])
            this.scene.add(this.props.model)
            // Orbit
            reset(this.props.model, this.camera, this.orbit)
        }
        // Setting hghlight and select
        if ((this.props.highlighted && this.props.highlighted.length > 0) || (this.props.marked && this.props.marked.length > 0)) {
            this.highlight_cache = {}
            this.setHighlight(this.props.model)
        }
        if (this.props.selected && this.props.selected.length > 0) {
            this.select_cache = {}
            this.setSelect(this.props.model)
        }
        // Resize
        this.resize()
    }

    resize() {
        if (this.div.current) {
            // Size
            const width = this.div.current.offsetWidth
            const height = this.div.current.offsetHeight
            // Camera
            this.camera.aspect = width / height
            this.camera.updateProjectionMatrix()
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

    updateHovered(position: { clientX: number, clientY: number }) {
        if (this.hovered) {
            this.props.out && this.props.out(this.hovered)
            this.hovered = null
        }
        
        this.raycaster.setFromCamera(this.normalizeMousePosition(position), this.camera)
        const intersections = this.raycaster.intersectObjects(this.scene.children, true)

        console.log(intersections)

        for (let i = 0; i < intersections.length; i++) {
            let iterator = intersections[i].object
            if (iterator instanceof Mesh) {
                while (iterator && !iterator.name) {
                    iterator = iterator.parent
                }
                this.hovered = iterator
                console.log(iterator)
                break
            }
        }
            
        if (this.hovered) {
            this.div.current.title = this.hovered.name
            this.div.current.style.cursor = 'pointer'
        } else {
            this.div.current.title = ''
            this.div.current.style.cursor = 'default'
        }

        this.hovered && this.props.over && this.props.over(this.hovered)
    }

    updateSelected(position: { clientX: number, clientY: number }) {
        this.updateHovered(position)
        this.hovered && this.props.click && this.props.click(this.hovered)
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

    handleMouseUp() {
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

    handleTouchEnd() {
        if (this.calculateDistance() <= 1) {
            this.updateSelected(this.position_end)
        }
        this.position_start = null
        this.position_end = null
    }

    handleDragEnter() {
        // TODO drag enter
    }

    handleDragOver(e: React.DragEvent) {
        e.stopPropagation()
        e.preventDefault()

        // TODO drag over
    }

    handleDragLeave() {
        // TODO drag leave
    }

    handleDrop(e: React.DragEvent) {
        if (this.props.drop) {
            this.props.drop(e, this.unproject(e.clientX, e.clientY))
        }
    }

    private unproject(x: number, y: number) {
        const vec = new Vector3()
        const pos = new Vector3()

        let i = this.renderer.domElement as HTMLElement

        let top = 0
        let left = 0

        while (i) {
            top += i.offsetTop
            left += i.offsetLeft

            i = i.offsetParent as HTMLElement
        }

        const width = this.renderer.domElement.offsetWidth
        const height = this.renderer.domElement.offsetHeight

        vec.set(
            ( (x - left) / width ) * 2 - 1,
            - ( (y - top) / height ) * 2 + 1,
            0.5,
        )
            
        vec.unproject( this.camera )
            
        vec.sub( this.camera.position ).normalize()
            
        const distance = - this.camera.position.y / vec.y
            
        pos.copy( this.camera.position ).add( vec.multiplyScalar( distance ) )

        return pos
    }

    paint() {
        this.orbit.update()
        this.renderer.render(this.scene, this.camera)
    }
    
    override render() {
        return <div className="widget model_view_3d" onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp} onTouchStart={this.handleTouchStart} onTouchMove={this.handleTouchMove} onTouchEnd={this.handleTouchEnd} onDragEnter={this.handleDragEnter} onDragOver={this.handleDragOver} onDragLeave={this.handleDragLeave} onDrop={this.handleDrop} ref={this.div}/>
    }
    
}