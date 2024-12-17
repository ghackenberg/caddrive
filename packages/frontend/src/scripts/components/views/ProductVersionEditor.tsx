import * as React from 'react'
import { useContext } from 'react'
import { useParams } from 'react-router'

import { Box3, Group, Mesh, Object3D, Vector3, MeshBasicMaterial, BufferGeometry, Material, LineSegments } from 'three'

import { VersionClient } from '../../clients/rest/version'
import { VersionContext } from '../../contexts/Version'
import { createScene } from '../../functions/editor'
import { useVersion } from '../../hooks/entity'
import { useAsyncHistory } from '../../hooks/history'
import { useVersions } from '../../hooks/list'
import { getMaterialColor, getMaterials, getObjectMaterialCode, loadLDrawModel, parseLDrawModel } from '../../loaders/ldraw'
import { ModelView3D } from '../widgets/ModelView3D'

const BLOCKS = ['3005', '3004', '3622', '3010', '3009', '3008', '6111', '6112', '2465', '3003', '3002', '3001', '2456', '3007', '3006', '2356', '6212', '4202', '4201', '4204', '30072']

export const ProductVersionEditorView = () => {

    // HISTORY

    const { goBack } = useAsyncHistory()

    // PARAMS

    const { productId, versionId } = useParams<{ productId: string, versionId: string }>()

    // CONTEXTS

    const { setContextVersion } = useContext(VersionContext)

    // HOOKS

    const versions = useVersions(productId)
    const version = versionId != 'new' && useVersion(productId, versionId)

    // REFS

    const inputRef = React.createRef<HTMLInputElement>()

    // STATES

    const [loaded, setLoaded] = React.useState<number>()
    const [total, setTotal] = React.useState<number>()
    const [model, setModel] = React.useState<Group>()
    const [manipulator, setManipulator] = React.useState<Group>()

    const [availableMaterials, setAvailableMaterials] = React.useState<Material[]>()
    const [selectedMaterial, setSelectedMaterial] = React.useState<Material>()

    const [part, setPart] = React.useState<Object3D[]>()
    const [create, setCreate] = React.useState<boolean>()
    const [partInserted, setPartInserted] = React.useState<boolean>()
    const [multipleFallbackParts, setMultipleFallbackParts] = React.useState<Object3D[]>([])

    const [selectedParts] = React.useState<Object3D[]>([])
    const [correctionVector, setCorrectionVector] = React.useState<Vector3>()
    const [correctionVectorCalculated, setCorrectionVectorCalculated] = React.useState<boolean>()

    const [selectedMeshMaterials] = React.useState<Material[]>([])
    const [selectedLineMaterials] = React.useState<Material[]>([])
    const [selectedIndex, setSelectedIndex] = React.useState<number>()

    const [rotationStartPos, setRotationStartPos] = React.useState<Vector3>()
    const [lastRotation, setlastRotation] = React.useState<number>()

    const [save, setSave] = React.useState(false)
    const [description, setDescription] = React.useState('')
    const [number, setNumber] = React.useState('patch')

    // Initialize 3D scene with grid and manipulators
    React.useEffect(() => {
        const [model, manipulator] = createScene()
        setManipulator(manipulator)
        setModel(model)
    }, [])

    // Load available materials and set initial selected material
    React.useEffect(() => {
        let exec = true
        getMaterials().then(materials => {
            if (exec) {
                setAvailableMaterials(materials)
                setSelectedMaterial(materials[10])
            }
        })
        return () => { exec = false }
    }, [])

    // Load existing LDraw model associated with version
    React.useEffect(() => {
        let exec = true
        if (model && versionId != 'new') {
            let group: Group
            loadLDrawModel(`${versionId}.ldr`, (_part, loaded, total) => {
                if (exec) {
                    setLoaded(loaded)
                    setTotal(total)
                    if (group) {
                        for (const child of group.children) {
                            model.add(child)
                        }
                    }
                }
            }).then(g => {
                group = g
            })
        }
        return () => { exec = false }
    }, [model, versionId])

    React.useEffect(() => {
        inputRef.current && inputRef.current.focus()
    }, [inputRef])

    function calculateOffset(part: Object3D[], index: number) {
        if (!part || !part[0].name || !part[0].name.endsWith('.dat')) {
            console.log(part)
            throw 'Unexpected part'
        }
        if (correctionVectorCalculated) {
            return
        }
        const offsetVector = new Vector3()
        const bbox = new Box3()
        if (index != undefined && index >= 0) {
           bbox.setFromObject(part[index])
        } else {
            for (const element of part) {
                bbox.expandByObject(element,true)
            }
        }
        bbox.getSize(offsetVector)
        if (offsetVector.x === 0) {
            setCorrectionVectorCalculated(false)
            return
        }
        offsetVector.x = Math.round(100*(offsetVector.x%40)/2)/100
        offsetVector.z = Math.round(100*(offsetVector.z%40)/2)/100
        offsetVector.y = Math.round(100*(offsetVector.y-4 + ((offsetVector.y-4)%8)/2))/100
        setCorrectionVector(offsetVector)
        setCorrectionVectorCalculated(true)
    }

    function moveParts(movement: Vector3, partarray = part) {
        for (const element of partarray) {
            element.position.add(movement)
        }
        manipulator.position.add(movement)
    }

    function setFallbackForMultiple(parts = selectedParts) {
        const fallbackArray: Object3D[] = []
        for (const element of parts) {
            fallbackArray.push(element.clone())
        }
        setMultipleFallbackParts(fallbackArray)
    }

    function axisMovement(axisName: string, pos: Vector3, parts = part) {
        if (selectedParts.length > 0) {
            let position = manipulator.position
            calculateOffset(selectedParts, selectedIndex)
            if(selectedIndex) {
                position = selectedParts[selectedIndex].position
            }
            if (!correctionVector) {
                return
            }
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
                    if(!rotationStartPos || lastRotation == undefined) {
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
                    if (angle != lastRotation) {
                        angle -= lastRotation
                        for (const element of parts) {
                            const rotationVec = element.position.clone()
                            element.position.sub(rotationVec.sub(manipulator.position))
                            element.position.add(rotationVec.applyAxisAngle(new Vector3(0,1,0),angle))
                            element.rotateY(angle)
                        }
                        setlastRotation(lastRotation + angle)
                    }
                }
            }
        }
    }

    function onPartDragStart(dragPart: Object3D, pos: Vector3) {
        const index = selectedParts.indexOf(dragPart)
        if (dragPart && index == -1) {
            unselect()
            setSelectedIndex(0)
            setFallbackForMultiple([dragPart])
            calculateOffset([dragPart],0)
            dragPart.position.set(Math.round((pos.x)/20)*20,
                Math.round(-pos.y/8)*8,
                Math.round((-pos.z)/20)*20
            )
            setPart([dragPart])
        } else if (dragPart) {
            setSelectedIndex(index)
            setFallbackForMultiple(selectedParts)
            calculateOffset([dragPart], 0)
            moveParts(new Vector3((Math.round((pos.x)/20)*20) -  dragPart.position.x,
            (Math.round(-pos.y/8)*8) - dragPart.position.y,
            (Math.round((-pos.z)/20)*20) - dragPart.position.z), selectedParts)
            
            manipulator.position.set(selectedParts[index].position.x, selectedParts[index].position.y, selectedParts[index].position.z)
            setPart(selectedParts)
        }
        setCreate(false)
    }

    function onPartDrag(pos: Vector3) {
        if (part) {
            calculateOffset(part, selectedIndex)
            moveParts(new Vector3((Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x) -  part[selectedIndex].position.x,
                (Math.round(-pos.y/8)*8) - part[selectedIndex].position.y,
                (Math.round((-pos.z - correctionVector.z)/20)*20 + correctionVector.z) - part[selectedIndex].position.z))
        }
    }

    function onPartDrop(pos: Vector3) {
        if (part) {
            calculateOffset(part, selectedIndex)
            moveParts(new Vector3((Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x) -  part[selectedIndex].position.x,
                (Math.round(-pos.y/8)*8) - part[selectedIndex].position.y,
                (Math.round((-pos.z - correctionVector.z)/20)*20 + correctionVector.z) - part[selectedIndex].position.z))
            
            setCorrectionVectorCalculated(false)
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
            setCorrectionVectorCalculated(false)
            unselect(multipleFallbackParts)
        }
    }

    function onDragStart(event: React.DragEvent, file: string) {
        unselect()
        event.dataTransfer.setDragImage(new Image(), 0, 0)
        parseLDrawModel(file, `1 ${selectedMaterial.userData.code} 0 0 0 1 0 0 0 1 0 0 0 1 ${file}`,null,false).then(part => {
            setPart([part.children[0]])
        })
        setCorrectionVector(new Vector3(0,0,0))
        setCorrectionVectorCalculated(false)
        setCreate(true)
        setPartInserted(false)
    }

    function onDragEnter(_event: React.DragEvent, pos: Vector3) {
        if (part && part.length > 0) {
            if (create) {
                model.add(part[0])
                setPartInserted(true)
            }
            calculateOffset(part, 0)
            part[0].position.set(Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x,
                Math.round(-pos.y/8)*8 - correctionVector.y,
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
            calculateOffset(part, 0)
            part[0].position.set(Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x,
                Math.round(-pos.y/8)*8 - correctionVector.y,
                Math.round((-pos.z + correctionVector.z)/20)*20 - correctionVector.z
            )
        }
    }

    function onDrop(pos: Vector3) {
        if (part && part.length > 0) {
            calculateOffset(part, 0)
            part[0].position.set(Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x,
                Math.round(-pos.y/8)*8 - correctionVector.y,
                Math.round((-pos.z + correctionVector.z)/20)*20 - correctionVector.z
            )
            setCorrectionVectorCalculated(false)
            setPart(undefined)
        }
    }

    function onMoveOnAxisStart(object: Object3D, pos: Vector3) {
        if (selectedParts) {
            setFallbackForMultiple()
            setPart(selectedParts)
            setlastRotation(0)
            setRotationStartPos(pos)
            axisMovement(object.name, pos, selectedParts)
            setCreate(false)
        }
    }

    function onMoveOnAxisContinue(pos: Vector3, axisName: string) {
        axisMovement(axisName, pos)
    }

    function onMoveOnAxisDrop(pos: Vector3, axisName: string) {
        axisMovement(axisName, pos)
        setRotationStartPos(undefined)
        setCorrectionVectorCalculated(false)
        setPart(undefined)
        setlastRotation(undefined)
    }

    function onMouseOver(object: Object3D) {
        if (object.name === "x" || object.name === "y" || object.name === "z" || object.name === "rotation y") {
            object.traverse(function(obj) {
                const mater = obj as Mesh<BufferGeometry,MeshBasicMaterial>
                if (mater.isMesh) {
                    mater.material.color.set("yellow")
                }
            })
        }
    }

    function onMouseOut(object: Object3D) {
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

    function onKeyDown(key: React.KeyboardEvent) {
        if (selectedParts && key.key == "Delete") {
            for (const element of selectedParts) {
                model.remove(element)
            }
            unselect()
        }
    }

    function onColorChanged(event: React.MouseEvent, mat: Material) {
        event.stopPropagation()
        setSelectedMaterial(mat)
        if (selectedMeshMaterials.length > 0) {
            for (const i in selectedMeshMaterials) {
                selectedMeshMaterials[i] = mat
                selectedLineMaterials[i] = mat.userData.edgeMaterial
            }
        }
    }

    function onClick(object: Object3D, isCtrlPressed: boolean) {
        !isCtrlPressed && unselect()
        if (object != null && object.name.endsWith(".dat")) {
            let index = selectedParts.indexOf(object)
            if (index == -1) {
                object.traverse(function(obj) {
                    if (obj instanceof Mesh) {
                        selectedMeshMaterials.push(obj.material)
                        selectedParts.push(object)

                        obj.material = obj.material.clone()
                        obj.material.color.set("white")
                    } else if (obj instanceof LineSegments && !obj.material.name.includes("Conditional")) {
                        selectedLineMaterials.push(obj.material)
                        obj.material = obj.material.clone()
                        obj.material.color.set("red")
                    }
                })
                index = selectedMeshMaterials.length - 1
            }
            setSelectedIndex(index)
            setSelectedMaterial(selectedMeshMaterials[index])

            manipulator.position.set(object.position.x,object.position.y,object.position.z)
            manipulator.visible = true
        } else if (isCtrlPressed) {
            const box  = new Box3()
            for (const element of selectedParts) {
                box.expandByObject(element,true)
            }
            const vec = new Vector3()
            box.getCenter(vec)
            manipulator.position.set(vec.x, -vec.y, -vec.z)
            setSelectedIndex(undefined)
        }
    }

    function unselect(partsToUnselect = selectedParts) {
        for (let i = partsToUnselect.length; i > 0; i--) {
            const material = selectedMeshMaterials.pop()
            const object = selectedParts.pop()
            const lineMaterial = selectedLineMaterials.pop()

            object && object.traverse(function(obj) {
                if (obj instanceof Mesh) {
                    obj.material = material
                } else if (obj instanceof LineSegments && !obj.material.name.includes("Conditional")) {
                    obj.material = lineMaterial
                }
            })        
        }
        manipulator.visible = false
    }

    async function onSave() {
        unselect()
        const baseVersionIds =  versionId != 'new' ? [versionId] : []
        
        const relative = versionId != 'new' ? version : (versions.length > 0 ? versions[versions.length - 1] : null)
        
        let major = relative && (number == 'major' || number == 'minor' || number == 'patch') ? relative.major : 0
        let minor = relative && (number == 'minor' || number == 'patch') ? relative.minor : 0
        let patch = relative && (number == 'patch') ? relative.patch : 0

        for (const version of versions) {
            if (number == 'major' && version.major == major) {
                major++
            } else if (number == 'minor' && version.major == major && version.minor == minor) {
                minor++
            } else if (number == 'patch' && version.major == major && version.minor == minor && version.patch == patch) {
                patch++
            }
        }

        const data = { baseVersionIds, major, minor, patch, description }

        let ldraw = ''

        for (const child of model.children) {
            if (child.name && child.name.endsWith('.dat')) {
                const color = await getObjectMaterialCode(child)

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

        const newVers = await VersionClient.addVersion(productId, data, files)

        setContextVersion(newVers)

        await goBack()
    }

    async function onCancel() {
        if (confirm('Are you sure?')) {
            await goBack()
        }
    }

    return  (
        <main className={`view product-version-editor`}>
            <div className='editor'>
                <div className='model'>
                    {model && (
                        <ModelView3D model={model} over={onMouseOver} out={onMouseOut} click={onClick} keyDown={onKeyDown} moveStart={onPartDragStart} move={onPartDrag} moveDrop={onPartDrop} moveAborted={onPartDragAbborted} moveOnAxisStart={onMoveOnAxisStart} moveOnAxis={onMoveOnAxisContinue} moveOnAxisDrop={onMoveOnAxisDrop} drop={onDrop} drag={onDrag} drageEnter={onDragEnter} dragLeave={onPartDragAbborted}/>
                    )}
                    {loaded != total && (
                        <div className='progress'>
                            <div className='bar' style={{width: `${Math.floor(loaded / total * 100)}%`}}></div>
                            <div className='text'>{loaded} / {total}</div>
                        </div>
                    )}
                    <div className='buttons'>
                        <button className='button fill green' onClick={() => { setSave(true) }}>
                            Save
                        </button>
                        <button className='button stroke green' onClick={onCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
                <div className="palette">
                    <div className="parts">
                        {BLOCKS.map(block => (
                            <img key={block} src={`/rest/parts/${block}.png`} onDragStart={event => onDragStart(event, `${block}.dat`)}/>
                        ))}
                    </div>
                    <div className="colors">
                        {availableMaterials ? (
                            <>
                                {availableMaterials.map(mat => (
                                    <a key={mat.userData.code} title={mat.name.trim()} className={mat == selectedMaterial ? 'selected' : ''} style={{backgroundColor: getMaterialColor(mat), borderColor: getMaterialColor(mat.userData.edgeMaterial)}} onClick={event => onColorChanged(event,mat)}/>
                                ))}
                            </>
                        ) : (
                            <span>Loading materials</span>
                        )}
                    </div>
                </div>
                {save && (
                    <div className='save'>
                        <div className='form'>
                            <div className='text'>
                                <input ref={inputRef} className='button fill lightgray' placeholder='Description' required={true} value={description} onChange={event => setDescription(event.currentTarget.value)}/>
                            </div>
                            <div className='number'>
                                <input type='radio' name='number' value='major' checked={number == 'major'} onChange={event => setNumber(event.currentTarget.value)}/>
                                <span>Major</span>
                                <input type='radio' name='number' value='minor' checked={number == 'minor'} onChange={event => setNumber(event.currentTarget.value)}/>
                                <span>Minor</span>
                                <input type='radio' name='number' value='patch' checked={number == 'patch'} onChange={event => setNumber(event.currentTarget.value)}/>
                                <span>Patch</span>
                            </div>
                            <div className='action'>
                                <button className='button fill green' onClick={onSave}>
                                    Save
                                </button>
                                <button className='button stroke green' onClick={() => setSave(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}