import { BlobReader } from '@zip.js/zip.js'

import { parseFreeCADModel } from 'productboard-freecad'

import { parseBRep } from './brep'
import { CacheAPI } from '../clients/cache'

export async function loadFreeCADModel(path: string) {
    const file = await CacheAPI.loadFile(path)
    return parseFreeCADModel(new BlobReader(new Blob([file])), parseBRep)
}