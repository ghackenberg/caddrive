import { BlobReader } from '@zip.js/zip.js'
import { parseFreeCADModel } from 'productboard-freecad'
import { CacheAPI } from '../clients/cache.js'
import { parseBRep } from './brep.js'

export async function loadFreeCADModel(path: string) {
    const file = await CacheAPI.loadFile(path)
    return parseFreeCADModel(new BlobReader(new Blob([file])), parseBRep)
}