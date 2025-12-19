import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { CacheAPI } from "../clients/cache.js"

const GLTF_LOADER = new GLTFLoader()

export async function loadGLTFModel(path: string) {
    const file = await CacheAPI.loadFile(path)
    return parseGLTFModel(file)
}

export async function parseGLTFModel(data: ArrayBuffer) {
    return new Promise<GLTF>((resolve, reject) => {
        GLTF_LOADER.parse(data, undefined, resolve, reject)
    })
}