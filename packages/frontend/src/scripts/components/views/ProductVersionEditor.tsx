import * as React from 'react'

import { GridHelper, Group, Object3D, Vector3 } from 'three'

import { parseLDrawModel } from '../../loaders/ldraw'
import { ModelView3D } from '../widgets/ModelView3D'

export const ProductVersionEditorView = () => {

    const [model, setModel] = React.useState<Group>()
    //const [file, setFile] = React.useState<string>()
    const [part, setPart] = React.useState<Object3D>()
    const [create, setCreate] = React.useState<boolean>()
    //let part = initpart

    //TODO implement reset point
    //let partBeforeMove = new Object3D()

    //let dragModel = new Mesh()

    React.useEffect(() => {
        const size = 20
        const divisions = 20
        const gridHelper = new GridHelper( size, divisions, 'red', 'blue' )
        const model = new Group()
        model.add( gridHelper )
        setModel(model)
    }, [])

    function onDragStart(event: React.DragEvent, file: string) {
        event.dataTransfer.setDragImage(new Image(), 0, 0)
        parseLDrawModel(file, `1 10 0 0 0 1 0 0 0 1 0 0 0 1 ${file}`).then(setPart)
        setCreate(true)
    }
    function onPartDragStart(dragPart: Object3D, pos: Vector3) {
        if (dragPart) {
            console.log("Part drag",dragPart)
            dragPart.parent.position.set(pos.x, pos.y, pos.z)
            setPart(dragPart.parent)
            setCreate(false)
        }
        
    }
    function onPartDragAbborted() {
        if (part) {
            if (create) {
                model.remove(part)
            }
            setPart(undefined)
            //part = new Group()
            //model.add(partBeforeMove)
        }
    }
    function onDragEnter(_event: React.DragEvent, pos: Vector3) {
        console.log("drag Enter", part)
        /*
        const geometry = new BoxGeometry( 1, 1, 1 )
        const material = new MeshBasicMaterial( {color: 0xff0000} )
        dragModel = new Mesh( geometry, material )
        */
        if (part) {
            if (create) {
                model.add(part)
            }
            part.position.set(pos.x, pos.y, pos.z)
        }

    }
    function onDrag(pos: Vector3) {
        //console.log("drag", pos)
        //model.remove(part)
        //const geometry = new BoxGeometry( 1, 1, 1 )
        //const material = new MeshBasicMaterial( {color: 0xff0000} )
        //dragModel = new Mesh( geometry, material )
        if (part) {
            part.position.set(pos.x, pos.y, pos.z)
        }
        //model.add(part)
    }
    function onDragLeave(_event: React.DragEvent) {
        console.log("drag Leave", _event)
        if (part) {
            if (create) {
                model.remove(part)
            }
        }
        //dragModel = null
    }
    function onDrop(pos: Vector3) {
        //console.log('drop', pos)
        //model.remove(dragModel)
        //dragModel = null
        /*
        const geometry = new BoxGeometry( 1, 1, 1 )
        const material = new MeshBasicMaterial( {color: 0x00ff00} )
        const cube = new Mesh( geometry, material )
        */
        if (part) {
            part.position.set(pos.x, pos.y, pos.z)
            setPart(undefined)
        }
        //model.add(cube)
    }
    function onOver() {
        //console.log('over', object)
    }
    function onOut() {
        //console.log('out', object)
    }
    function onClick() {
        //console.log('click', object)
    }

    return  (
        <main className={`view product-version-editor`}>
            <div className='model'>
                {model && <ModelView3D model={model} over={onOver} out={onOut} click={onClick} moveStart={onPartDragStart} moveAborted={onPartDragAbborted} drop={onDrop} drag={onDrag} drageEnter={onDragEnter} dragLeave={onDragLeave}/>}
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