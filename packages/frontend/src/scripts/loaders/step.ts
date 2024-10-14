import { BufferGeometry, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, Object3D } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { CacheAPI } from '../clients/cache'
import { worker } from '../worker'

const TEXT_DECODER = new TextDecoder()

const GLTF = new GLTFLoader()

export async function loadSTEPModel(path: string) {
    const file = await CacheAPI.loadFile(path)
    const text = TEXT_DECODER.decode(file)
    return parseSTEPModel(text)
}

export async function parseSTEPModel(data: string) {
    return new Promise<Group>((resolve, reject) => {
        // Define handlers
        function handleMessage(message: MessageEvent) {
            worker.removeEventListener('message', handleMessage)
            worker.removeEventListener('messageerror', handleMessageError)
            worker.removeEventListener('error', handleError)
            if (message.data instanceof Uint8Array) {
                GLTF.parse(message.data.buffer, undefined, gltf => {
                    gltf.scene.rotateX(-Math.PI / 2)
                    postProcess(gltf.scene)
                    resolve(gltf.scene)
                }, reject)
            } else {
                reject('Return message data type unexpected: ' + message.data)
            }
        }
        function handleMessageError(message: MessageEvent) {
            worker.removeEventListener('message', handleMessage)
            worker.removeEventListener('messageerror', handleMessageError)
            worker.removeEventListener('error', handleError)
            reject(message)
        }
        function handleError(error: ErrorEvent) {
            worker.removeEventListener('message', handleMessage)
            worker.removeEventListener('messageerror', handleMessageError)
            worker.removeEventListener('error', handleError)
            reject(error)
        }
        // Add handlers
        worker.addEventListener('message', handleMessage)
        worker.addEventListener('messageerror', handleMessageError)
        worker.addEventListener('error', handleError)
        // Post message
        worker.postMessage('stp')
        worker.postMessage(data)
    })
}

function postProcess(object: Object3D) {
    for (const child of object.children) {
        postProcess(child)
    }

    if (object instanceof Mesh) {
        object.name = undefined
        
        const geometry = object.geometry as BufferGeometry

        const edge_geometry = new EdgesGeometry(geometry.clone(), 45)
        const edge_material = new LineBasicMaterial({ color: 'black' })

        const lines = new LineSegments(edge_geometry, edge_material)
        lines.position.copy(object.position)
        lines.rotation.copy(object.rotation)

        object.parent.add(lines)
    }
}