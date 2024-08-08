import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

import { CacheAPI } from '../clients/cache'

const FBX_LOADER = new FBXLoader()

export async function loadFBXModel(path: string) {
    const file = await CacheAPI.loadFile(path)
    return parseFBXModel(file)
}

export async function parseFBXModel(data: ArrayBuffer) {
    return await FBX_LOADER.parse(data, '')
}