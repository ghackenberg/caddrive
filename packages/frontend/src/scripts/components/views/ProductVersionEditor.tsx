import * as React from 'react'

import { CylinderGeometry, Box3, GridHelper, Group, Mesh, Object3D, Vector3, MeshBasicMaterial, BufferGeometry, MeshStandardMaterial } from 'three'

import { parseLDrawModel } from '../../loaders/ldraw'
import { ModelView3D } from '../widgets/ModelView3D'

export const ProductVersionEditorView = () => {

    const [model, setModel] = React.useState<Group>()
    //const [file, setFile] = React.useState<string>()
    const [part, setPart] = React.useState<Object3D>()
    const [create, setCreate] = React.useState<boolean>()
    const [fallbackPart, setfallbackPart] = React.useState<Object3D>()
    //const [lastPart, setlastPart] = React.useState<Object3D>()
    const [selectedPart, setselectedPart] = React.useState<Object3D>()
    //let part = initpart
    const [correctionVector, setcorrectionVector] = React.useState<Vector3>()
    const [vecCalculated, setVecCalculated] = React.useState<boolean>()
    //let dragModel = new Mesh()

    React.useEffect(() => {
        const size = 400
        const divisions = 20
        const gridHelper = new GridHelper( size, divisions, 'red', 'blue' )
        const model = new Group()
        model.add( gridHelper )
        setModel(model)
    }, [])

    function onDragStart(event: React.DragEvent, file: string) {
        /*if(lastPart) {
            lastPart.remove(lastPart.getObjectByName("x"),lastPart.getObjectByName("y"),lastPart.getObjectByName("z"))
        }*/
        unselect()
        event.dataTransfer.setDragImage(new Image(), 0, 0)
        parseLDrawModel(file, `1 10 0 0 0 1 0 0 0 1 0 0 0 1 ${file}`).then(part => {
            part.name = `${file}-submodel`
            setPart(part)
            //setlastPart(part)
        })
        setcorrectionVector(new Vector3(0,0,0))
        setVecCalculated(false)
        setCreate(true)
    }
    function CalculateOffset(part: Object3D) {
        if (!part || !part.name || !part.name.endsWith('submodel')) {
            console.log(part)
            throw 'Unexpected part'
        }
        if (vecCalculated || part.children.length == 0) {
            return
        }

        const bbox = new Box3().setFromObject(part.children[0]);
        
        /*
        part.traverse(function(obj) {
            const group = obj as Group
            // logic for whether or not to include the child
            //console.log("possible group",group)
            if (group.isGroup && group.name != "x" && group.name != "y" && group.name != "z" ) {
                // initialize the box to the first valid child found otherwise expand the bounds
                //console.log("group",group)
                if (bbox == null) {
                    bbox = new Box3()
                    bbox.setFromObject(obj)
                } else {
                    bbox.expandByObject(obj)
                }
            }
        })
        /*
        for( const child of part.children) {
            console.log("child", child)
            if (child.name != "x" && child.name != "y" && child.name != "z" ) {
                // initialize the box to the first valid child found otherwise expand the bounds
                if (bbox == null) {
                    bbox = new Box3()
                    bbox.setFromObject(child)
                } else {
                    bbox.expandByObject(child)
                }
            }
        }
            */
        const offsetVector = new Vector3()
        bbox.getSize(offsetVector)
        offsetVector.round()
        //console.log(offsetVector)
        if (offsetVector.x === 0) {
            setVecCalculated(false)
            return
        }

        offsetVector.x = (offsetVector.x%40)/2
        offsetVector.z = (offsetVector.z%40)/2
        offsetVector.y = offsetVector.y-4 + ((offsetVector.y-4)%8)/2
        setcorrectionVector(offsetVector)
        setVecCalculated(true)
    }
    function onPartDragStart(dragPart: Object3D, pos: Vector3) {
        if (dragPart) {
            unselect()
            /*if(lastPart) {
                lastPart.remove(lastPart.getObjectByName("x"),lastPart.getObjectByName("y"),lastPart.getObjectByName("z"))
            }*/
            setfallbackPart(dragPart.parent.clone())
            CalculateOffset(dragPart.parent)
            dragPart.parent.position.set(Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x,
                Math.round(pos.y/8)*8 + correctionVector.y,//(pos.y-correctionVector.y)/8)*8 + correctionVector.y,
                Math.round((pos.z - correctionVector.z)/20)*20 + correctionVector.z
            )
            /*
            //yAxis
            const cyZB = new CylinderGeometry(1, 1, 20)
            const maZB = new MeshBasicMaterial({ color: 'red' ,depthTest: false})
            const meZB = new Mesh(cyZB, maZB)
            meZB.position.set(0, -12, 0)

            const cyZA = new CylinderGeometry(2, 0, 2)
            const maZA = new MeshBasicMaterial({ color: 'red' ,depthTest: false })
            const meZA = new Mesh(cyZA, maZA)
            meZA.position.set(0, -22, 0)
            
            const yAxis = new Group()
            yAxis.name = 'y'
            yAxis.add(meZB)
            yAxis.add(meZA)

            dragPart.parent.add(yAxis)

            //zAxis
            const cyYB = new CylinderGeometry(1, 1, 20)
            const maYB = new MeshBasicMaterial({ color: 'blue' ,depthTest: false})
            const meYB = new Mesh(cyYB, maYB)
            meYB.rotateX(Math.PI/2)
            meYB.position.set(0, 0, -12)

            const cyYA = new CylinderGeometry(2, 0, 2)
            const maYA = new MeshBasicMaterial({ color: 'blue' ,depthTest: false})
            const meYA = new Mesh(cyYA, maYA)
            meYA.rotateX(Math.PI/2)
            meYA.position.set(0, 0, -22)

            const zAxis = new Group()
            zAxis.name = 'z'
            zAxis.add(meYB)
            zAxis.add(meYA)

            dragPart.parent.add(zAxis)

            //xAxis
            const cyXB = new CylinderGeometry(1, 1, 20)
            const maXB = new MeshBasicMaterial({ color: 'green' ,depthTest: false})
            const meXB = new Mesh(cyXB, maXB)
            meXB.rotateZ(-Math.PI/2)
            meXB.position.set(12, 0, 0)

            const cyXA = new CylinderGeometry(2, 0, 2)
            const maXA = new MeshBasicMaterial({ color: 'green' ,depthTest: false})
            const meXA = new Mesh(cyXA, maXA)
            meXA.rotateZ(Math.PI/2)
            meXA.position.set(22, 0, 0)

            const xAxis = new Group()
            xAxis.name = 'x'
            xAxis.add(meXB)
            xAxis.add(meXA)
            dragPart.parent.add(xAxis)
            */
            setPart(dragPart.parent)
            setCreate(false)
            //setlastPart(dragPart.parent)
        }
        
    }
    function onPartDragAbborted() {
        if (part) {
            /*
            if (create) {
                //TODO not used?
                model.remove(part)
            }
            */
            model.remove(part)
            model.add(fallbackPart)
            setPart(undefined)
            setselectedPart(fallbackPart)
            //setlastPart(fallbackPart)
            setVecCalculated(false)
            //part = new Group()
            //model.add(partBeforeMove)
        }
    }
    function onDragEnter(_event: React.DragEvent, pos: Vector3) {
        /*
        const geometry = new BoxGeometry( 1, 1, 1 )
        const material = new MeshBasicMaterial( {color: 0xff0000} )
        dragModel = new Mesh( geometry, material )
        */
        if (part) {
            if (create) {
                model.add(part)
            }
            CalculateOffset(part)
            part.position.set(Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x,
                Math.round(pos.y/8)*8 + correctionVector.y,//(pos.y-correctionVector.y)/8)*8 + correctionVector.y,
                Math.round((pos.z - correctionVector.z)/20)*20 + correctionVector.z
            )
        }

    }
    function onDrag(pos: Vector3) {
        //model.remove(part)
        //const geometry = new BoxGeometry( 1, 1, 1 )
        //const material = new MeshBasicMaterial( {color: 0xff0000} )
        //dragModel = new Mesh( geometry, material )
        if (part) {
            CalculateOffset(part)
            part.position.set(Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x,
                Math.round(pos.y/8)*8 + correctionVector.y,//(pos.y-correctionVector.y)/8)*8 + correctionVector.y,
                Math.round((pos.z - correctionVector.z)/20)*20 + correctionVector.z
            )
        }
        //model.add(part)
    }
    function onDragLeave() {
        if (part) {
            if (create) {
                model.remove(part)
            }
        }
        //dragModel = null
    }
    function onDrop(pos: Vector3) {
        //model.remove(dragModel)
        //dragModel = null
        /*
        const geometry = new BoxGeometry( 1, 1, 1 )
        const material = new MeshBasicMaterial( {color: 0x00ff00} )
        const cube = new Mesh( geometry, material )
        */
        if (part) {
            CalculateOffset(part)
            part.position.set(Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x,
                Math.round(pos.y/8)*8 + correctionVector.y,//(pos.y-correctionVector.y)/8)*8 + correctionVector.y,
                Math.round((pos.z - correctionVector.z)/20)*20 + correctionVector.z
            )
            setVecCalculated(false)
            setPart(undefined)
        }
        //model.add(cube)
    }
    function onMoveOnAxisStart(object: Object3D, pos: Vector3) {
        CalculateOffset(object.parent)
        setfallbackPart(object.parent.clone())
        switch (object.name) {
            case "x": {
                object.parent.position.setX(Math.round((pos.x - correctionVector.x)/20)*20 + correctionVector.x)
                break
            }
            case "y": {
                object.parent.position.setY(Math.round(pos.y/8)*8)
                break
            }
            case "z": {
                object.parent.position.setZ(Math.round((pos.z - correctionVector.z)/20)*20 + correctionVector.z)
            }
        }
        setPart(object.parent)
        setCreate(false)
    }
    function onMoveOnAxis(pos: Vector3, axisName: string) {
        if(part) {
            CalculateOffset(part)
            switch (axisName) {
                case "x": {
                    part.position.setX(Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x)
                    break
                }
                case "y": {
                    part.position.setY(Math.round(pos.y/8)*8)
                    break
                }
                case "z": {
                    part.position.setZ(Math.round((pos.z - correctionVector.z)/20)*20 + correctionVector.z)
                }
            }
        }
    }
    function onMoveOnAxisDrop(pos: Vector3, axisName: string) {
        if (part) {
            CalculateOffset(part)
            switch (axisName) {
                case "x": {
                    part.position.setX(Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x)
                    break
                }
                case "y": {
                    part.position.setY(Math.round(pos.y/8)*8)
                    break
                }
                case "z": {
                    part.position.setZ(Math.round((pos.z - correctionVector.z)/20)*20 + correctionVector.z)
                }
            }
            setPart(part)
            setCreate(false)
        }
    }
    function onOver(object: Object3D) {
        if (object.name === "x" || object.name === "y" || object.name === "z") {
            object.traverse(function(obj) {
                const mater = obj as Mesh<BufferGeometry,MeshBasicMaterial>
                if(mater.isMesh) {
                    mater.material.color.set("yellow")
                }
            })
        }
    }
    function onOut(object: Object3D) {
        let color : string
        switch (object.name) {
            case "x": {
                color = "green"
                break
            }
            case "y": {
                color = "red"
                break
            }
            case "z": {
                color = "blue"
                break
            }
        }
        object.traverse(function(obj) {
            const mater = obj as Mesh<BufferGeometry,MeshBasicMaterial>
            if(mater.isMesh) {
                mater.material.color.set(color)
            }
        })
    }
    function onClick(object: Object3D) {
        console.log('click', object)
        unselect()
        if(object != null && object.name.endsWith(".dat")) {

            object.traverse(function(obj) {
                const mater = obj as Mesh<BufferGeometry,MeshStandardMaterial>
                if(mater.isMesh) {
                    mater.material = mater.material.clone()
                    mater.material.color.set("white")
                }
            })

            //yAxis
            const cyZB = new CylinderGeometry(1, 1, 20)
            const maZB = new MeshBasicMaterial({ color: 'red' ,depthTest: false})
            const meZB = new Mesh(cyZB, maZB)
            meZB.position.set(0, -12, 0)

            const cyZA = new CylinderGeometry(2, 0, 2)
            const maZA = new MeshBasicMaterial({ color: 'red' ,depthTest: false })
            const meZA = new Mesh(cyZA, maZA)
            meZA.position.set(0, -22, 0)
            
            const yAxis = new Group()
            yAxis.name = 'y'
            yAxis.add(meZB)
            yAxis.add(meZA)

            object.parent.add(yAxis)

            //zAxis
            const cyYB = new CylinderGeometry(1, 1, 20)
            const maYB = new MeshBasicMaterial({ color: 'blue' ,depthTest: false})
            const meYB = new Mesh(cyYB, maYB)
            meYB.rotateX(Math.PI/2)
            meYB.position.set(0, 0, -12)

            const cyYA = new CylinderGeometry(2, 0, 2)
            const maYA = new MeshBasicMaterial({ color: 'blue' ,depthTest: false})
            const meYA = new Mesh(cyYA, maYA)
            meYA.rotateX(Math.PI/2)
            meYA.position.set(0, 0, -22)

            const zAxis = new Group()
            zAxis.name = 'z'
            zAxis.add(meYB)
            zAxis.add(meYA)

            object.parent.add(zAxis)

            //xAxis
            const cyXB = new CylinderGeometry(1, 1, 20)
            const maXB = new MeshBasicMaterial({ color: 'green' ,depthTest: false})
            const meXB = new Mesh(cyXB, maXB)
            meXB.rotateZ(-Math.PI/2)
            meXB.position.set(12, 0, 0)

            const cyXA = new CylinderGeometry(2, 0, 2)
            const maXA = new MeshBasicMaterial({ color: 'green' ,depthTest: false})
            const meXA = new Mesh(cyXA, maXA)
            meXA.rotateZ(Math.PI/2)
            meXA.position.set(22, 0, 0)

            const xAxis = new Group()
            xAxis.name = 'x'
            xAxis.add(meXB)
            xAxis.add(meXA)
            object.parent.add(xAxis)

            setPart(object.parent)

            setselectedPart(object.parent)
        }
        else {
            setselectedPart(undefined)
        }
    }
    function unselect() {
        selectedPart && selectedPart.traverse(function(obj) {
            const mater = obj as Mesh<BufferGeometry,MeshStandardMaterial>
            if(mater.isMesh) {
                mater.material.color.setRGB(0.09758734713304495,0.407240211891531, 0.05286064701616471 )
            }
        })
        selectedPart && selectedPart.remove(selectedPart.getObjectByName("x"),selectedPart.getObjectByName("y"),selectedPart.getObjectByName("z"))
    }

    return  (
        <main className={`view product-version-editor`}>
            <div className='model'>
                {model && <ModelView3D model={model} over={onOver} out={onOut} click={onClick} moveStart={onPartDragStart} moveAborted={onPartDragAbborted} moveOnAxisStart={onMoveOnAxisStart} moveOnAxis={onMoveOnAxis} moveOnAxisDrop={onMoveOnAxisDrop} drop={onDrop} drag={onDrag} drageEnter={onDragEnter} dragLeave={onDragLeave}/>}
            </div>
            <div className="palette">
                <img src='/rest/parts/3001.png' onDragStart={event => onDragStart(event, '3001.dat')}/>
                <img src='/rest/parts/3002.png' onDragStart={event => onDragStart(event, '3002.dat')}/>
                <img src='/rest/parts/3003.png' onDragStart={event => onDragStart(event, '3003.dat')}/>
                <img src='/rest/parts/3004.png' onDragStart={event => onDragStart(event, '3004.dat')}/>
            </div>
        </main>
    )
}