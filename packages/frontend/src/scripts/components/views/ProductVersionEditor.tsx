import * as React from 'react'

import { BoxGeometry, GridHelper, Group, Mesh, MeshBasicMaterial, Object3D, Vector3 } from 'three'

import { ModelView3D } from '../widgets/ModelView3D'

export const ProductVersionEditorView = () => {

    const [model, setModel] = React.useState(new Group())

    React.useEffect(() => {
        const size = 20
        const divisions = 20
        const gridHelper = new GridHelper( size, divisions, 'red', 'blue' )
        const model = new Group()
        model.add( gridHelper )
        setModel(model)
    }, [])

    function onDragStart(_event: React.DragEvent) {
        //console.log('drag start', event)
    }
    function onDrop(_event: React.DragEvent, pos: Vector3) {
        console.log('drop', pos)
        const geometry = new BoxGeometry( 1, 1, 1 )
        const material = new MeshBasicMaterial( {color: 0x00ff00} )
        const cube = new Mesh( geometry, material )
        cube.position.set(pos.x, pos.y, pos.z)
        model.add(cube)
    }
    function onOver(object: Object3D) {
        console.log('over', object)
    }
    function onOut(object: Object3D) {
        console.log('out', object)
    }
    function onClick(object: Object3D) {
        console.log('click', object)
    }

    return  (
        <main className={`view product-version-editor`}>
            <div className='model'>
                <ModelView3D model={model} over={onOver} out={onOut} click={onClick} drop={onDrop}/>
            </div>
            <div className="palette">
                <img src='/rest/parts/3001.png' onDragStart={onDragStart}/>
                <img src='/rest/parts/3002.png' onDragStart={onDragStart}/>
                <img src='/rest/parts/3003.png' onDragStart={onDragStart}/>
                <img src='/rest/parts/3004.png' onDragStart={onDragStart}/>
            </div>
        </main>
    )
}