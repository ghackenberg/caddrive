import { WebIO } from '@gltf-transform/core'
import { EXTMeshoptCompression, KHRDracoMeshCompression } from '@gltf-transform/extensions'
import { quantize, reorder } from '@gltf-transform/functions'
import { createDecoderModule, createEncoderModule } from 'draco3dgltf'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'
import { BufferGeometry, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, Object3D } from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { CacheAPI } from '../clients/cache'
import { worker } from '../worker'

const TEXT_DECODER = new TextDecoder()

const DRACO = new DRACOLoader()
DRACO.setDecoderPath('/examples/jsm/libs/draco/')
DRACO.setDecoderConfig({ type: 'wasm' })
DRACO.preload()

const GLTF = new GLTFLoader()
GLTF.setDRACOLoader(DRACO)

export async function loadSTEPModel(path: string) {
    const file = await CacheAPI.loadFile(path)
    const text = TEXT_DECODER.decode(file)
    return parseSTEPModel(text)
}

export async function parseSTEPModel(data: string) {
    console.log('Start parsing STEP model')
    return new Promise<Group>((resolve, reject) => {
        // Define handlers
        async function handleMessage(message: MessageEvent) {
            worker.removeEventListener('message', handleMessage)
            worker.removeEventListener('messageerror', handleMessageError)
            worker.removeEventListener('error', handleError)
            if (message.data instanceof Uint8Array) {
                console.log("Waiting for Meshoptimizer")
                await MeshoptEncoder.ready
                await MeshoptDecoder.ready

                console.log("Creating WebIO")
                const io = new WebIO()
                    .registerExtensions([EXTMeshoptCompression, KHRDracoMeshCompression])
                    .registerDependencies({
                        'meshopt.decoder': MeshoptDecoder,
                        'meshopt.encoder': MeshoptEncoder,
                        'draco3d.decoder': await createDecoderModule(), // Optional.
                        'draco3d.encoder': await createEncoderModule(), // Optional.
                    })

                console.log('Reading document')
                const doc = await io.readBinary(message.data)

                console.log('Transforming document')
                await doc.transform(
                    reorder({ encoder: MeshoptEncoder }),
                    quantize()
                    //quantize({ pattern: /^(POSITION|TEXCOORD|JOINTS|WEIGHTS)(_\d+)?$/ })
                )

                console.log('Creating extension')
                doc.createExtension(EXTMeshoptCompression)
                    .setRequired(true)
                    //.setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER })
                    .setEncoderOptions({
                        method: EXTMeshoptCompression.EncoderMethod.QUANTIZE
                    })
                
                doc.createExtension(KHRDracoMeshCompression)
                    .setRequired(true)
                    .setEncoderOptions({
                        method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER,
                        encodeSpeed: 5,
                        decodeSpeed: 5
                    })

                console.log('Writing document')
                const final = await io.writeBinary(doc)

                console.log('Parsing GLB model', message.data.length)
                GLTF.setMeshoptDecoder(MeshoptDecoder)
                GLTF.parse(final.buffer, undefined, gltf => {
                    console.log('End parsing STEP model')
                    gltf.scene.rotateX(-Math.PI / 2)
                    postProcess(gltf.scene)
                    resolve(gltf.scene)
                }, reject)
            } else {
                console.log('End parsing STEP model with unexpected data type', message.data)
                reject('Return message data type unexpected: ' + message.data)
            }
        }
        function handleMessageError(message: MessageEvent) {
            console.log('End parsing STEP model with error message', message)
            worker.removeEventListener('message', handleMessage)
            worker.removeEventListener('messageerror', handleMessageError)
            worker.removeEventListener('error', handleError)
            reject(message)
        }
        function handleError(error: ErrorEvent) {
            console.log('End parsing STEP model with error', error)
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