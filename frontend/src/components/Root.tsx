import * as React from 'react'
import * as ReactHelmet from 'react-helmet'
import { Scene, Camera, PerspectiveCamera, WebGLRenderer, BoxGeometry, Material, Mesh, Light, PointLight, MeshPhongMaterial, AmbientLight } from 'three'

export default class Root extends React.Component {
    private div: React.RefObject<HTMLDivElement>
    private geometry: BoxGeometry
    private material: Material
    private mesh: Mesh
    private ambient_light: Light
    private point_light: Light
    private scene: Scene
    private camera: Camera
    private renderer: WebGLRenderer
    private frame: number

    constructor(props: {}) {
        super(props)
        this.div = React.createRef()
        this.paint = this.paint.bind(this)
    }
    
    componentDidMount() {
        // Geometry
        this.geometry = new BoxGeometry()
        // Material
        this.material = new MeshPhongMaterial({ color: 0x00ff00 })
        // Mesh
        this.mesh = new Mesh(this.geometry, this.material)
        // Ambient light
        this.ambient_light = new AmbientLight(0xffffff, 0.5)
        // Point light
        this.point_light = new PointLight(0xffffff, 1, 100)
        this.point_light.position.set(50,50,50)
        // Scene
        this.scene = new Scene()
        this.scene.add(this.mesh)
        this.scene.add(this.ambient_light)
        this.scene.add(this.point_light)
        // Camera
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
        this.camera.position.z = 5
        // Renderer
        this.renderer = new WebGLRenderer({ antialias: true })
        this.renderer.setSize(500, 500)
        this.renderer.setClearColor(0xffffff)
        // Div
        this.div.current.appendChild(this.renderer.domElement)
        // Frame
        this.frame = requestAnimationFrame(this.paint)
    }
    
    componentWillUnmount() {
        cancelAnimationFrame(this.frame)
    }

    paint() {
        this.mesh.rotation.x += 0.01
        this.mesh.rotation.y += 0.01
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.paint)
    }
    
    render() {
        return (
            <React.Fragment>
                <ReactHelmet.Helmet>
                    <title>FH OÖ Audit Platform Frontend</title>
                    <link rel="icon" href="/images/icon.png"/>
                </ReactHelmet.Helmet>
                <h1>FH OÖ Audit Platform Frontend</h1>
                <div ref={this.div}></div>
            </React.Fragment>
        )
    }
}