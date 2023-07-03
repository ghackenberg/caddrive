import { Group, LoadingManager } from "three"
import { LDrawLoader } from "three/examples/jsm/loaders/LDrawLoader"

import { CacheAPI } from "../clients/cache"

const TEXT_DECODER = new TextDecoder()

const LOADING_MANAGER = new LoadingManager().setURLModifier(url => {
    if (url.indexOf('/') == -1) {
        return `/rest/parts/${url}`
    } else {
        return `/rest/parts/${url.substring(url.lastIndexOf('/') + 1)}`
    }
})

const LDRAW_LOADER = new LDrawLoader(LOADING_MANAGER)

LDRAW_LOADER.preloadMaterials('/rest/parts/LDConfig.ldr').then(() => {
    console.log('Materials loaded!')
}).catch(error => {
    console.error(error)
})

export async function loadLDrawModel(path: string) {
    const file = await CacheAPI.loadFile(path)
    return parseLDrawModel(TEXT_DECODER.decode(file))
}

export async function parseLDrawModel(data: string) {
    return new Promise<Group>(resolve => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (LDRAW_LOADER as any).parse(data, (group: Group) => {
            // Fix coordinates
            group.rotation.x = Math.PI
            // Resolve
            resolve(group)
        })
    })
}