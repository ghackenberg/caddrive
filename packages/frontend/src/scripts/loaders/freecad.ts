import { BlobReader } from '@zip.js/zip.js'

import { CacheAPI } from 'productboard-client'
import { parseFreeCADModel } from 'productboard-freecad'

import { parseBRep } from './brep'

export async function loadFreeCADModel(path: string) {
    const file = await CacheAPI.loadFile(path)
    return parseFreeCADModel(new BlobReader(new Blob([file])), parseBRep)
}