import { BlobReader } from '@zip.js/zip.js'

import { parseFCStdModel } from 'productboard-freecad'

import { parseBRep } from './brep'
import { CacheAPI } from '../clients/cache'

export async function loadFCStdModel(path: string) {
    const file = await CacheAPI.loadFile(path)
    return parseFCStdModel(new BlobReader(new Blob([file])), parseBRep)
}