import * as React from 'react'
import { useContext } from 'react'
import { useParams } from 'react-router'

import { Box3, Group, Mesh, Object3D, Vector3, Material, LineSegments, MeshStandardMaterial } from 'three'

import { VersionClient } from '../../clients/rest/version'
import { VersionContext } from '../../contexts/Version'
import { createScene } from '../../functions/editor'
import { useVersion } from '../../hooks/entity'
import { useAsyncHistory } from '../../hooks/history'
import { useVersions } from '../../hooks/list'
import { getMaterialColor, getMaterials, getObjectMaterialCode, loadLDrawModel, parseLDrawModel } from '../../loaders/ldraw'
import { ModelView3D } from '../widgets/ModelView3D'

import BlankIcon from '/src/images/blank.png'

const BLANK = new Image()
BLANK.src = BlankIcon

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
    const [isPartCreate, setIsPartCreate] = React.useState<boolean>()
    const [isPartInserted, setIsPartInserted] = React.useState<boolean>()
    const [multipleFallbackParts, setMultipleFallbackParts] = React.useState<Object3D[]>([])

    const [correctionVector, setCorrectionVector] = React.useState<Vector3>()
    const [correctionVectorCalculated, setCorrectionVectorCalculated] = React.useState<boolean>()

    const [selectedParts] = React.useState<Object3D[]>([])
    const [selectedMeshMaterials] = React.useState<Material[]>([])
    const [selectedLineMaterials] = React.useState<Material[]>([])
    const [selectedPartIndex, setSelectedPartIndex] = React.useState<number>()

    const [rotationStartPos, setRotationStartPos] = React.useState<Vector3>()
    const [lastRotation, setLastRotation] = React.useState<number>()

    const [save, setSave] = React.useState(false)
    const [description, setDescription] = React.useState('')
    const [number, setNumber] = React.useState('patch')

    // EFFECTS

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

    // FUNCTIONS

    function calculateOffset(parts: Object3D[], index: number) {
        // Check parameter values
        if (!parts || !parts[0].name || !parts[0].name.endsWith('.dat')) {
            throw 'Unexpected part'
        }
        
        // Check component state
        if (correctionVectorCalculated) {
            return
        }

        // Calculate bounding box
        const bbox = new Box3()
        if (index != undefined && index >= 0) {
           bbox.setFromObject(parts[index])
        } else {
            for (const element of parts) {
                bbox.expandByObject(element,true)
            }
        }

        // Calculate offset vector
        const offsetVector = bbox.getSize(new Vector3())

        if (offsetVector.x === 0) {
            // Update component state
            setCorrectionVectorCalculated(false)
        } else {
            // Discretize vector coordinates
            offsetVector.x = Math.round(100*(offsetVector.x%40)/2)/100
            offsetVector.z = Math.round(100*(offsetVector.z%40)/2)/100
            offsetVector.y = Math.round(100*(offsetVector.y-4 + ((offsetVector.y-4)%8)/2))/100

            // Update component state
            setCorrectionVector(offsetVector)
            setCorrectionVectorCalculated(true)
        }
    }

    function moveParts(delta: Vector3, parts = part) {
        for (const element of parts) {
            element.position.add(delta)
        }
        manipulator.position.add(delta)
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
            calculateOffset(selectedParts, selectedPartIndex)
            if(selectedPartIndex) {
                position = selectedParts[selectedPartIndex].position
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
                        setLastRotation(lastRotation + angle)
                    }
                }
            }
        }
    }

    // Define selected parts and start moving
    function onPartDragStart(part: Object3D, pos: Vector3) {
        console.log('onPartDragStart', part, pos)

        // Check input parameters
        if (!part) {
            throw 'Part expected'
        }

        // Update create state
        setIsPartCreate(false)

        // Check if part has been selected
        const index = selectedParts.indexOf(part)

        // Start moving single part or selected parts
        if (index == -1) {
            // Branch 1: Single part

            unselect()
            
            setSelectedPartIndex(0)
            setFallbackForMultiple([part])
            
            calculateOffset([part], 0)

            const x = Math.round((pos.x)/20)*20
            const y = Math.round(-pos.y/8)*8
            const z = Math.round((-pos.z)/20)*20

            part.position.set(x, y, z)

            setPart([part])
        } else {
            // Branch 2: Multiple parts

            setSelectedPartIndex(index)
            setFallbackForMultiple(selectedParts)
            
            calculateOffset([part], 0)

            const x = (Math.round((pos.x)/20)*20) - part.position.x
            const y = (Math.round(-pos.y/8)*8) - part.position.y
            const z = (Math.round((-pos.z)/20)*20) - part.position.z

            moveParts(new Vector3(x, y, z), selectedParts)
            
            manipulator.position.set(selectedParts[index].position.x, selectedParts[index].position.y, selectedParts[index].position.z)

            setPart(selectedParts)
        }
    }

    // Move selected parts
    function onPartDrag(pos: Vector3) {
        console.log('onPartDrag', pos)

        if (part) {
            calculateOffset(part, selectedPartIndex)

            const x = (Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x) -  part[selectedPartIndex].position.x
            const y = (Math.round(-pos.y/8)*8) - part[selectedPartIndex].position.y
            const z = (Math.round((-pos.z - correctionVector.z)/20)*20 + correctionVector.z) - part[selectedPartIndex].position.z

            moveParts(new Vector3(x, y, z))
        }
    }

    // Move selected parts
    function onPartDrop(pos: Vector3) {
        console.log('onPartDrop', pos)

        if (part) {
            calculateOffset(part, selectedPartIndex)

            const x = (Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x) -  part[selectedPartIndex].position.x
            const y = (Math.round(-pos.y/8)*8) - part[selectedPartIndex].position.y
            const z = (Math.round((-pos.z - correctionVector.z)/20)*20 + correctionVector.z) - part[selectedPartIndex].position.z

            moveParts(new Vector3(x, y, z))                
            
            setCorrectionVectorCalculated(false)
            setPart(undefined)
        }
    }

    // Remove new parts and move existing parts to their original location
    function onPartDragLeave() {
        console.log('onPartDragLeave')

        if (isPartCreate) {
            // Remove new part
            if (part.length > 0) {
                model.remove(part[0])
            }
        } else {
            // Move existing parts to their original location
            if (multipleFallbackParts.length != 0) {
                for (const i in multipleFallbackParts) {
                    const x = multipleFallbackParts[i].position.x
                    const y = multipleFallbackParts[i].position.y
                    const z = multipleFallbackParts[i].position.z
    
                    part[i].position.set(x, y, z)
                }
    
                setCorrectionVectorCalculated(false)
                
                unselect(multipleFallbackParts)
            }
        }
    }

    // Load part in the background
    function onDragStart(event: React.DragEvent, file: string) {
        console.log('onDragStart', file)

        unselect()

        event.dataTransfer.setDragImage(BLANK, 0, 0)

        parseLDrawModel(file, `1 ${selectedMaterial.userData.code} 0 0 0 1 0 0 0 1 0 0 0 1 ${file}`, null, false).then(part => {
            setPart([part.children[0]])
        })
        
        setCorrectionVector(new Vector3(0, 0, 0))
        setCorrectionVectorCalculated(false)
        
        setIsPartCreate(true)
        setIsPartInserted(false)
    }

    // Insert loaded part into scene and move part around the scene
    function onDragEnter(_event: React.DragEvent, pos: Vector3) {
        console.log('onDragEnter', pos)

        if (part && part.length > 0) {
            // Insert loaded part into scene
            if (isPartCreate) {
                model.add(part[0])
                setIsPartInserted(true)
            }

            // Move part around the scene
            calculateOffset(part, 0)

            const x = Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x
            const y = Math.round(-pos.y/8)*8 - correctionVector.y
            const z = Math.round((-pos.z + correctionVector.z)/20)*20 - correctionVector.z

            part[0].position.set(x, y, z)
        }
    }

    // Insert loaded part into scene and move part around the scene
    function onDrag(pos: Vector3) {
        console.log('onDrag', pos)

        if (part && part.length > 0) {
            // Insert loaded part into scene
            if (isPartCreate && !isPartInserted) {
                model.add(part[0])
                setIsPartInserted(true)
            }

            // Move part around the scene
            calculateOffset(part, 0)

            const x = Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x
            const y = Math.round(-pos.y/8)*8 - correctionVector.y
            const z = Math.round((-pos.z + correctionVector.z)/20)*20 - correctionVector.z

            part[0].position.set(x, y, z)
        }
    }

    // Move loaded part to it's final position and stop moving
    function onDrop(pos: Vector3) {
        console.log('onDrop', pos)

        if (part && part.length > 0) {
            calculateOffset(part, 0)

            const x = Math.round((pos.x-correctionVector.x)/20)*20 + correctionVector.x
            const y = Math.round(-pos.y/8)*8 - correctionVector.y
            const z = Math.round((-pos.z + correctionVector.z)/20)*20 - correctionVector.z

            part[0].position.set(x, y, z)

            setCorrectionVectorCalculated(false)
            setPart(undefined)
        }
    }

    function onMoveOnAxisStart(object: Object3D, pos: Vector3) {
        console.log('onMoveOnAxisStart', object, pos)

        if (selectedParts) {
            setFallbackForMultiple()
            setPart(selectedParts)
            setLastRotation(0)
            setRotationStartPos(pos)
            axisMovement(object.name, pos, selectedParts)
            setIsPartCreate(false)
        }
    }

    function onMoveOnAxisContinue(pos: Vector3, axisName: string) {
        console.log('onMoveOnAxisContinue', pos, axisName)

        axisMovement(axisName, pos)
    }

    function onMoveOnAxisDrop(pos: Vector3, axisName: string) {
        console.log('onMoveOnAxisDrop', pos, axisName)

        axisMovement(axisName, pos)
        setRotationStartPos(undefined)
        setCorrectionVectorCalculated(false)
        setPart(undefined)
        setLastRotation(undefined)
    }

    function onMouseOver(part: Object3D) {
        console.log('onMouseOver', part)

        if (part.name === "x" || part.name === "y" || part.name === "z" || part.name === "rotation y") {
            part.traverse(object => {
                if (object instanceof Mesh) {
                    object.material.color.set("yellow")
                }
            })
        }
    }

    function onMouseOut(part: Object3D) {
        console.log('onMouseOut', part)

        let color : string
        switch (part.name) {
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
        part.traverse(object => {
            if(object instanceof Mesh) {
                object.material.color.set(color)
            }
        })
    }

    function onKeyDown(key: React.KeyboardEvent) {
        console.log('onKeyDown', key.key)

        if (selectedParts && key.key == "Delete") {
            for (const element of selectedParts) {
                model.remove(element)
            }
            unselect()
        }
    }

    function onColorChanged(event: React.MouseEvent, material: Material) {
        console.log('onColorChanged', material)

        event.stopPropagation()
        // Remember material
        setSelectedMaterial(material)
        // Change material of selected parts
        if (selectedMeshMaterials.length > 0) {
            // Update target materials of selected parts
            for (const i in selectedMeshMaterials) {
                selectedMeshMaterials[i] = material
                selectedLineMaterials[i] = material.userData.edgeMaterial
            }
            // Update current materials of selected parts
            for (const part of selectedParts) {
                part && part.traverse(object => {
                    if (object instanceof Mesh) {
                        object.material = material.clone()
                        if (object.material instanceof MeshStandardMaterial) {
                            object.material.emissive.setScalar(0.1)
                        } else {
                            throw 'Material type not supported'
                        }
                    } else if (object instanceof LineSegments) {
                        if (!object.material.name.includes("Conditional")) {
                            object.material = material.userData.edgeMaterial.clone()
                        }
                    }
                })  
            }
        }
    }

    function onClick(part: Object3D, isCtrlPressed: boolean) {
        console.log('onClick', part, isCtrlPressed)

        !isCtrlPressed && unselect()
        if (part != null && part.name.endsWith(".dat")) {
            let index = selectedParts.indexOf(part)
            if (index == -1) {
                part.traverse(object => {
                    if (object instanceof Mesh) {
                        selectedParts.push(part)
                        selectedMeshMaterials.push(object.material)
                        object.material = object.material.clone()
                        if (object.material instanceof MeshStandardMaterial) {
                            object.material.emissive.setScalar(0.1)
                        } else {
                            console.log(object.material.constructor.name)
                            throw 'Material type not supported'
                        }
                    } else if (object instanceof LineSegments) {
                        if (!object.material.name.includes("Conditional")) {
                            selectedLineMaterials.push(object.material)
                            object.material = object.material.clone()
                        }
                    }
                })
                index = selectedMeshMaterials.length - 1
            }
            // Update selection
            setSelectedPartIndex(index)
            setSelectedMaterial(selectedMeshMaterials[index])
            // Update manipulator
            manipulator.position.set(part.position.x,part.position.y,part.position.z)
            manipulator.visible = true
        } else if (isCtrlPressed) {
            const box  = new Box3()
            for (const element of selectedParts) {
                box.expandByObject(element,true)
            }
            const vec = new Vector3()
            box.getCenter(vec)
            manipulator.position.set(vec.x, -vec.y, -vec.z)
            setSelectedPartIndex(undefined)
        }
    }

    function unselect(partsToUnselect = selectedParts) {
        for (let i = partsToUnselect.length; i > 0; i--) {
            const part = selectedParts.pop()
            
            const meshMaterial = selectedMeshMaterials.pop()
            const lineMaterial = selectedLineMaterials.pop()

            part && part.traverse(object => {
                if (object instanceof Mesh) {
                    object.material = meshMaterial
                } else if (object instanceof LineSegments) {
                    if (!object.material.name.includes("Conditional")) {
                        object.material = lineMaterial
                    }
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

        //console.log(ldraw)

        const model2 = new Blob([ldraw], { type: 'application/x-ldraw' })
        const image: Blob = null
        const files = { model: model2, image }

        const newVers = await VersionClient.addVersion(productId, data, files)

        setContextVersion(newVers)

        await goBack()
    }

    return  (
        <main className={`view product-version-editor`}>
            <div className='editor'>
                <div className='model'>
                    {model && (
                        <ModelView3D model={model} over={onMouseOver} out={onMouseOut} click={onClick} keyDown={onKeyDown} moveStart={onPartDragStart} move={onPartDrag} moveDrop={onPartDrop} moveAborted={onPartDragLeave} moveOnAxisStart={onMoveOnAxisStart} moveOnAxis={onMoveOnAxisContinue} moveOnAxisDrop={onMoveOnAxisDrop} drop={onDrop} drag={onDrag} drageEnter={onDragEnter} dragLeave={onPartDragLeave}/>
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