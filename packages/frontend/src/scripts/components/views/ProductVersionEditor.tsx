import * as React from 'react'
import { useContext } from 'react'
import { useParams } from 'react-router'

import { CylinderGeometry, Box3, GridHelper, Group, Mesh, Object3D, Vector3, MeshBasicMaterial, BufferGeometry, MeshStandardMaterial, TorusGeometry, CircleGeometry } from 'three'

import { VersionClient } from '../../clients/rest/version'
import { VersionContext } from '../../contexts/Version'
import { useAsyncHistory } from '../../hooks/history'
import { loadLDrawModel, parseLDrawModel } from '../../loaders/ldraw'
import { ModelView3D } from '../widgets/ModelView3D'

export const ProductVersionEditorView = () => {

    // HISTORY

    const { goBack } = useAsyncHistory()

    // PARAMS

    const { productId, versionId } = useParams<{ productId: string, versionId: string }>()

    // CONTEXTSD

    const { setContextVersion } = useContext(VersionContext)

    // STATES

    const [model, setModel] = React.useState<Group>()
    const [manipulator, setManipulator] = React.useState<Group>()
    const [part, setPart] = React.useState<Object3D[]>()
    const [create, setCreate] = React.useState<boolean>()
    const [partInserted, setPartInserted] = React.useState<boolean>()
    const [multipleFallbackParts, setMultpleFallbackParts] = React.useState<Object3D[]>()

    const [selectedPart, setSelectedPart] = React.useState<Object3D[]>()
    const [correctionVector, setCorrectionVector] = React.useState<Vector3>()
    const [vecCalculated, setVecCalculated] = React.useState<boolean>()

    const [selectedMaterials, setSelectedMaterials] = React.useState<MeshStandardMaterial[]>()
    const [selectedIndex, setSelectedIndex] = React.useState<number>()

    const [rotationStartPos, setRotationStartPos] = React.useState<Vector3>()
    //const [lastRotation, setlastRotation] = React.useState<number>()
    let lastRotation = 0

    React.useEffect(() => {
        const size = 400
        const divisions = 20
        const grid = new GridHelper( size, divisions, 'red', 'blue' )

        //x-axis
        const cyXB = new CylinderGeometry(1, 1, 20)
        const maXB = new MeshBasicMaterial({ color: 'green' ,depthTest: false})
        const meXB = new Mesh(cyXB, maXB)
        meXB.renderOrder = 999
        meXB.rotateZ(-Math.PI/2)
        meXB.position.set(12, 0, 0)

        const cyXA = new CylinderGeometry(2, 0, 2)
        const maXA = new MeshBasicMaterial({ color: 'green' ,depthTest: false})
        const meXA = new Mesh(cyXA, maXA)
        meXA.renderOrder = 999
        meXA.rotateZ(Math.PI/2)
        meXA.position.set(22, 0, 0)

        const arrowX = new Group()
        arrowX.name = 'x'
        arrowX.add(meXA)
        arrowX.add(meXB)

        //y-axis
        const cyYB = new CylinderGeometry(1, 1, 20)
        const maYB = new MeshBasicMaterial({ color: 'red' ,depthTest: false ,depthWrite: false})
        const meYB = new Mesh(cyYB, maYB)
        meYB.renderOrder = 999
        meYB.position.set(0, -12, 0)

        const cyYA = new CylinderGeometry(2, 0, 2)
        const maYA = new MeshBasicMaterial({ color: 'red' ,depthTest: false ,depthWrite: false})
        const meYA = new Mesh(cyYA, maYA)
        meYA.renderOrder = 999
        meYA.position.set(0, -22, 0)
        
        const arrowY = new Group()
        arrowY.name = 'y'
        arrowY.add(meYA)
        arrowY.add(meYB)

        //z-axis
        const cyZB = new CylinderGeometry(1, 1, 20)
        const maZB = new MeshBasicMaterial({ color: 'blue' ,depthTest: false ,depthWrite: false})
        const meZB = new Mesh(cyZB, maZB)
        meZB.renderOrder = 999
        meZB.rotateX(Math.PI/2)
        meZB.position.set(0, 0, -12)

        const cyZA = new CylinderGeometry(2, 0, 2)
        const maZA = new MeshBasicMaterial({ color: 'blue' ,depthTest: false ,depthWrite: false})
        const meZA = new Mesh(cyZA, maZA)
        meZA.renderOrder = 999
        meZA.rotateX(Math.PI/2)
        meZA.position.set(0, 0, -22)

        const arrowZ = new Group()
        arrowZ.name = 'z'
        arrowZ.add(meZA)
        arrowZ.add(meZB)
        
        //rotation around y
        const trRYB = new TorusGeometry(15, 1, 16, 100, Math.PI/2)
        const maRYB = new MeshBasicMaterial({ color: 'red' ,depthTest: false ,depthWrite: false})
        const meRYB = new Mesh(trRYB, maRYB)
        meRYB.renderOrder = 999
        meRYB.rotateX(-Math.PI/2)
        meRYB.position.set(10, 0, -10)

        const cyRYA = new CylinderGeometry(0, 2, 2)
        const maRYA = new MeshBasicMaterial({ color: 'red' ,depthTest: false ,depthWrite: false})
        const meRYA = new Mesh(cyRYA, maRYA)
        meRYA.renderOrder = 999
        meRYA.rotateX(Math.PI/2)
        meRYA.position.set(25, 0, -10)

        const clRYE = new CircleGeometry(1)
        const maRYE = new MeshBasicMaterial({ color: 'red' ,depthTest: false ,depthWrite: false})
        const meRYE = new Mesh(clRYE, maRYE)
        meRYE.renderOrder = 999
        meRYE.rotateY(-Math.PI/2)
        meRYE.position.set(10, 0, -25)

        const arrowRotY = new Group()
        arrowRotY.name = 'rotation y'
        arrowRotY.add(meRYA)
        arrowRotY.add(meRYB)
        arrowRotY.add(meRYE)

        const manipulator = new Group()
        manipulator.visible = false
        manipulator.add(arrowX)
        manipulator.add(arrowY)
        manipulator.add(arrowZ)
        manipulator.add(arrowRotY)
        setManipulator(manipulator)

        setSelectedMaterials([])
        setSelectedPart([])
        setMultpleFallbackParts([])

        //Model
        const model = new Group()
        model.add(grid)
        model.add(manipulator)
        model.rotation.x = Math.PI
        setModel(model)
    }, [])

    React.useEffect(() => {
        let exec = true
        if (model && versionId != 'new') {
            let group: Group
            loadLDrawModel(`${versionId}.ldr`, () => {
                if (exec && group) {
                    for (const child of group.children) {
                        model.add(child)
                    }
                }
            }).then(g => {
                group = g
            })
        }
        return () => { exec = false }
    }, [model, versionId])

    function onDragStart(event: React.DragEvent, file: string) {
        unselect()
        event.dataTransfer.setDragImage(new Image(), 0, 0)
        parseLDrawModel(file, `1 10 0 0 0 1 0 0 0 1 0 0 0 1 ${file}`,null,false).then(part => {
            setPart([part.children[0]])
        })
        setCorrectionVector(new Vector3(0,0,0))
        setVecCalculated(false)
        setCreate(true)
        setPartInserted(false)
    }
    function CalculateOffset(part: Object3D[], index : number) {
        if (!part || !part[0].name || !part[0].name.endsWith('.dat')) {
            console.log(part)
            throw 'Unexpected part'
        }
        if (vecCalculated) {
            return
        }
        const offsetVector = new Vector3()
        const bbox = new Box3()
        if (index != undefined && index >= 0) {
            /*const bbox = new Box3().setFromObject(part[index]);
            
            bbox.getSize(offsetVector)
            offsetVector.round()
            */
           bbox.setFromObject(part[index])
        }
        else {
            for (const element of part) {
                bbox.expandByObject(element,true)
            }
        }
        bbox.getSize(offsetVector)
        if (offsetVector.x === 0) {
            setVecCalculated(false)
            return
        }
        offsetVector.x = Math.round(100*(offsetVector.x%40)/2)/100
        offsetVector.z = Math.round(100*(offsetVector.z%40)/2)/100
        offsetVector.y = Math.round(100*(offsetVector.y-4 + ((offsetVector.y-4)%8)/2))/100
        setCorrectionVector(offsetVector)
        setVecCalculated(true)
    }
    function moveParts(movement: Vector3, partarray = part) {
        for (const element of partarray) {
            element.position.add(movement)
        }
        manipulator.position.add(movement)
    }
    function setFallbackForMultiple(parts = selectedPart) {
        const fallbackArray: Object3D[] = []
        for (const element of parts) {
            fallbackArray.push(element.clone())
        }
        setMultpleFallbackParts(fallbackArray)
    }
    function axisMovement(axisName: string, pos: Vector3, parts = part) {
        if(selectedPart.length > 0) {
            let position = manipulator.position
            CalculateOffset(selectedPart, selectedIndex)
            //let rotation = manipulator.rotation
            if(selectedIndex) {
                position = selectedPart[selectedIndex].position
                //rotation = selectedPart[selectedIndex].rotation
                //CalculateOffset(selectedPart, selectedIndex)
            }
            /*else if(!vecCalculated) {                
                    setCorrectionVector(new Vector3(0,0,0))
                    setVecCalculated(true) 
            }*/
            switch (axisName) {
                case "x": {
                    const xcoord = (Math.round((pos.x - correctionVector.x)/20)*20 + correctionVector.x) - position.x
                    moveParts(new Vector3(xcoord,0,0),parts)
                    break
                }
                case "y": {
                    const ycoord = (Math.round(-pos.y/8)*8) - position.y
                    moveParts(new Vector3(0,ycoord,0),parts)
                    break
                }
                case "z": {
                    const zcoord = (Math.round((-pos.z + correctionVector.z)/20)*20 - correctionVector.z)- position.z
                    moveParts(new Vector3(0,0,zcoord),parts)
                    break
                }
                case "rotation y": {
                    if(!rotationStartPos) {
                        return
                    }
                    const vecA = new Vector3(rotationStartPos.x, -rotationStartPos.y, -rotationStartPos.z)
                    const vecB = new Vector3(pos.x, -pos.y, -pos.z)
                    vecA.sub(manipulator.position)
                    vecB.sub(manipulator.position)
                    let angle = -Math.round(vecA.angleTo(vecB)*4/Math.PI)*Math.PI/4
                    if (vecA.cross(vecB).y > 0) {
                        angle *= -1 
                    }
                    if  (angle != lastRotation) {
                        angle -= lastRotation
                        for (const element of parts) {
                            const rotationVec = element.position.clone()
                            element.position.sub(rotationVec.sub(manipulator.position))
                            element.position.add(rotationVec.applyAxisAngle(new Vector3(0,1,0),angle))
                            element.rotateY(angle)
                        }
                        lastRotation += angle
                    }
                }
            }
        }
    }
    function onPartDragStart(dragPart: Object3D, pos: Vector3) {
        const index = selectedPart.indexOf(dragPart)
        if (dragPart && index==-1) {
            unselect()
            setSelectedIndex(0)
            setFallbackForMultiple([dragPart])
            CalculateOffset([dragPart],0)
            dragPart.position.set(Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x,
                Math.round(-pos.y/8)*8,
                Math.round((-pos.z - correctionVector.z)/20)*20 + correctionVector.z
            )
            setPart([dragPart])
        }
        else if(dragPart) {
            setSelectedIndex(index)
            setFallbackForMultiple(selectedPart)
            CalculateOffset([dragPart], 0)
            moveParts(new Vector3((Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x) -  dragPart.position.x,
            (Math.round(-pos.y/8)*8) - dragPart.position.y,
            (Math.round((-pos.z - correctionVector.z)/20)*20 + correctionVector.z) - dragPart.position.z), selectedPart)
            
            manipulator.position.set(selectedPart[index].position.x, selectedPart[index].position.y, selectedPart[index].position.z)
            setPart(selectedPart)
        }
        setCreate(false)
    }
    function onPartDrag(pos: Vector3) {
        if (part) {
            CalculateOffset(part, selectedIndex)
            moveParts(new Vector3((Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x) -  part[selectedIndex].position.x,
                (Math.round(-pos.y/8)*8) - part[selectedIndex].position.y,
                (Math.round((-pos.z - correctionVector.z)/20)*20 + correctionVector.z) - part[selectedIndex].position.z))
        }
    }
    function onPartDragDrop(pos: Vector3) {
        if (part) {
            CalculateOffset(part, selectedIndex)
            moveParts(new Vector3((Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x) -  part[selectedIndex].position.x,
                (Math.round(-pos.y/8)*8) - part[selectedIndex].position.y,
                (Math.round((-pos.z - correctionVector.z)/20)*20 + correctionVector.z) - part[selectedIndex].position.z))
            
            setVecCalculated(false)
            setPart(undefined)
        }
    }
    function onPartDragAbborted() {
        if (part.length > 0 && create) {
            model.remove(part[0])
            return
        }
        if (multipleFallbackParts.length != 0) {
            for (const i in multipleFallbackParts) {
                part[i].position.set(multipleFallbackParts[i].position.x,multipleFallbackParts[i].position.y,multipleFallbackParts[i].position.z)
            }
            setVecCalculated(false)
            unselect(multipleFallbackParts)
        }
    }
    function onDragEnter(_event: React.DragEvent, pos: Vector3) {
        if (part && part.length > 0) {
            if (create) {
                model.add(part[0])
                setPartInserted(true)
            }
            CalculateOffset(part, 0)
            part[0].position.set(Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x,
                Math.round(-pos.y/8)*8 - correctionVector.y,//(pos.y-correctionVector.y)/8)*8 + correctionVector.y,
                Math.round((-pos.z + correctionVector.z)/20)*20 - correctionVector.z
            )
        }
    }
    function onDrag(pos: Vector3) {
        if (part && part.length > 0) {
            if (create  && !partInserted) {
                model.add(part[0])
                setPartInserted(true)
            }
            CalculateOffset(part, 0)
            part[0].position.set(Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x,
                Math.round(-pos.y/8)*8 - correctionVector.y,//(pos.y-correctionVector.y)/8)*8 + correctionVector.y,
                Math.round((-pos.z + correctionVector.z)/20)*20 - correctionVector.z
            )
        }
    }
    function onDrop(pos: Vector3) {
        if (part && part.length > 0) {
            CalculateOffset(part, 0)
            part[0].position.set(Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x,
                Math.round(-pos.y/8)*8 - correctionVector.y,//(pos.y-correctionVector.y)/8)*8 + correctionVector.y,
                Math.round((-pos.z + correctionVector.z)/20)*20 - correctionVector.z
            )
            setVecCalculated(false)
            setPart(undefined)
        }
    }
    function onMoveOnAxisStart(object: Object3D, pos: Vector3) {
        if(selectedPart) {
            setFallbackForMultiple()
            setPart(selectedPart)
            //setlastRotation(0)
            lastRotation = 0
            setRotationStartPos(pos)
            axisMovement(object.name, pos, selectedPart)
            setCreate(false)
        }
    }
    function onMoveOnAxis(pos: Vector3, axisName: string) {
        axisMovement(axisName, pos)
    }
    function onMoveOnAxisDrop(pos: Vector3, axisName: string) {
        axisMovement(axisName, pos)
        setRotationStartPos(undefined)
        setVecCalculated(false)
        setPart(undefined)
    }
    function onOver(object: Object3D) {
        if (object.name === "x" || object.name === "y" || object.name === "z" || object.name === "rotation y") {
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
            case "y":
            case "rotation y": {
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
    function onkeyDown(key: React.KeyboardEvent) {
        if(selectedPart && key.key == "Delete") {
            for (const element of selectedPart) {
                model.remove(element)
            }
            unselect()
        }
    }
    function onClick(object: Object3D, isCtrlPressed: boolean) {
        !isCtrlPressed && unselect()
        if(object != null && object.name.endsWith(".dat")) {
            let index = selectedPart.indexOf(object)
            if (index == -1) {
                object.traverse(function(obj) {
                const mater = obj as Mesh<BufferGeometry,MeshStandardMaterial>
                if(mater.isMesh) {
                    selectedMaterials.push(mater.material)
                    selectedPart.push(object)

                    mater.material = mater.material.clone()
                    mater.material.color.set("white")
                    }
                })
                index = selectedMaterials.length - 1
            }
            setSelectedIndex(index)
            //TODO: bonus: grid bei annäherung der Grenze expandieren; 
            //      bonus: grid bei verschibung höher gelegener teile in passender ebene anzeigen

            manipulator.position.set(object.position.x,object.position.y,object.position.z)
            manipulator.visible = true
        }
        else if (isCtrlPressed) {
            const box  = new Box3()
            for (const element of selectedPart) {
                box.expandByObject(element,true)
            }
            const vec = new Vector3()
            box.getCenter(vec)
            manipulator.position.set(vec.x, -vec.y, -vec.z)
            setSelectedIndex(undefined)
        }
    }
    function unselect(partsToUnselect = selectedPart) {
        for (let i = partsToUnselect.length; i > 0; i--) {
            const material = selectedMaterials.pop()
            const object = selectedPart.pop()
            object && object.traverse(function(obj) {
                const mater = obj as Mesh<BufferGeometry,MeshStandardMaterial>
                if(mater.isMesh) {
                    mater.material = material
                }
            })        
        }
        manipulator.visible = false
    }

    async function save() {
        const baseVersionIds =  versionId != 'new' ? [versionId] : []
        const major = parseInt(prompt('Major', '0'))
        const minor = parseInt(prompt('Minor', '0'))
        const patch = parseInt(prompt('Patch', '0'))
        const description = prompt('Description')
        const data = { baseVersionIds, major, minor, patch, description }

        let ldraw = ''
        for (const child of model.children) {
            if (child.name && child.name.endsWith('.dat')) {
                const color = '10'

                const x = child.position.x
                const y = child.position.y
                const z = child.position.z

                const a = child.matrix.elements[0]
                const b = child.matrix.elements[1]
                const c = child.matrix.elements[2]
                const d = child.matrix.elements[4]
                const e = child.matrix.elements[5]
                const f = child.matrix.elements[6]
                const g = child.matrix.elements[8]
                const h = child.matrix.elements[9]
                const i = child.matrix.elements[10]

                const file = child.name

                ldraw += `1 ${color} ${x} ${y} ${z} ${a} ${b} ${c} ${d} ${e} ${f} ${g} ${h} ${i} ${file}\n`
            }
        }

        console.log(ldraw)

        const model2 = new Blob([ldraw], { type: 'application/x-ldraw' })
        const image: Blob = null
        const files = { model: model2, image }

        const version = await VersionClient.addVersion(productId, data, files)

        setContextVersion(version)

        await goBack()
    }

    return  (
        <main className={`view product-version-editor`}>
            <div className='model' style={{position: 'relative'}}>
                {model && <ModelView3D model={model} over={onOver} out={onOut} click={onClick} keyDown={onkeyDown} moveStart={onPartDragStart} move={onPartDrag} moveDrop={onPartDragDrop} moveAborted={onPartDragAbborted} moveOnAxisStart={onMoveOnAxisStart} moveOnAxis={onMoveOnAxis} moveOnAxisDrop={onMoveOnAxisDrop} drop={onDrop} drag={onDrag} drageEnter={onDragEnter} dragLeave={onPartDragAbborted}/>}
                <button style={{position: 'absolute', left: '1em', top: '1em'}} onClick={save}>
                    Save
                </button>
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