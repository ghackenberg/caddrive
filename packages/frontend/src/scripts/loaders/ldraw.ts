import axios from "axios"
import * as THREE from "three"
import { LDrawLoader } from 'three/examples/jsm/loaders/LDrawLoader'

import { Model, Parser, Reference } from "productboard-ldraw"

import { CacheAPI } from "../clients/cache"
import { worker } from "../worker"

const TEXT_DECODER = new TextDecoder()

const LOADING_MANAGER = new THREE.LoadingManager().setURLModifier(url => {
    if (url.indexOf('/') == -1) {
        return `/rest/parts/${url}`
    } else {
        return `/rest/parts/${url.substring(url.lastIndexOf('/') + 1)}`
    }
})

const LDRAW_LOADER = new LDrawLoader(LOADING_MANAGER)

LDRAW_LOADER.preloadMaterials('/rest/parts/LDConfig.ldr').then(() => {
    // console.log('Materials loaded!')
}).catch(error => {
    console.error(error)
})

export async function loadLDrawModel(path: string) {
    const file = await CacheAPI.loadFile(path)
    const text = TEXT_DECODER.decode(file)
    worker.postMessage({ text, url: path })
    return parseLDrawModel(text)
}

export async function loadLDrawPath(path: string) {
    const response = await axios.get(path)
    return parseLDrawModel(response.data)
}

export async function parseLDrawModel(data: string) {
    return new Promise<THREE.Group>(resolve => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (LDRAW_LOADER as any).parse(data, (group: THREE.Group) => {
            // Fix coordinates
            group.rotation.x = Math.PI
            // Resolve
            resolve(group)
        })
    })
}

const PARSER = new Parser()

export class LDrawModelHandle {
    private active = true

    public readonly root = new THREE.Group()
    
    constructor(private path: string) {
        CacheAPI.loadFile(path).then(data => this.parseData(data))
    }

    public stop() {
        this.active = false
    }

    private parseData(data: ArrayBuffer) {
        if (this.active) {
            this.parseText(TEXT_DECODER.decode(data))
        }
    }
    private parseText(text: string) {
        if (this.active) {
            this.processModel(new THREE.MeshBasicMaterial({ color: 0x00ff00 }), new THREE.LineBasicMaterial({ color: 0x0000ff }), this.root, PARSER.parse(text, this.path))
        }
    }

    private processModel(face: THREE.Material, edge: THREE.Material, parent: THREE.Group, model: Model) {
        for (const reference of model.references) {
            this.processReference(face, edge, parent, model, reference)
        }
    }
    private async processReference(face: THREE.Material, edge: THREE.Material, parent: THREE.Group, model: Model, reference: Reference) {
        const position = reference.position
        const orientation = reference.orientation
        const child = new THREE.Group()
        child.name = reference.file
        child.matrix.set(
            orientation.a, orientation.b, orientation.c, position.x,
            orientation.d, orientation.e, orientation.f, position.y,
            orientation.g, orientation.h, orientation.i, position.z,
            0, 0, 0, 1
        )
        parent.add(child)
        if (model.fileIndex[reference.file]) {
            this.processModel(face, edge, child, model.fileIndex[reference.file])
        } else {
            if (reference.file.indexOf('/') == -1) {
                parent.add(await loadLDrawPath(`/rest/parts/${reference.file}`))
            } else {
                parent.add(await loadLDrawPath(`/rest/parts/${reference.file.substring(reference.file.lastIndexOf('/') + 1)}`))
            }
        }
    }
}