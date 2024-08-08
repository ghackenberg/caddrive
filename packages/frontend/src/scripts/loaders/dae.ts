import { Group } from 'three'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'

import { CacheAPI } from '../clients/cache'

const TEXT_DECODER = new TextDecoder()

const DAE_LOADER = new ColladaLoader()

export async function loadDAEModel(path: string) {
    const file = await CacheAPI.loadFile(path)
    const text = TEXT_DECODER.decode(file)
    return parseDAEModel(text)
}

export async function parseDAEModel(data: string) {
    const model = await DAE_LOADER.parse(data, '')
    const group = new Group()

    for (const child of model.scene.children) {
        group.add(child)
    }
    group.rotateX(Math.PI * 3 / 2)
    group.rotateZ(Math.PI * 3 / 2)

    return group
}