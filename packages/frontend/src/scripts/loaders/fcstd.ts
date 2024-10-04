import { TextWriter, ZipReader } from '@zip.js/zip.js'
import { Group } from 'three'

import { parseBRep } from './brep'

export async function loadFCStdModel(path: string) {
    console.log('Not yet implemented!', path)
    return new Group()
}

export async function parseFCStdModel(data: ReadableStream) {
    const reader = new ZipReader(data)
    const parser = new DOMParser()
    const entries = await reader.getEntries()
    for (const entry of entries) {
        if (entry.filename == 'Document.xml') {
            const writer = new TextWriter()
            const content = await entry.getData(writer)
            const document = parser.parseFromString(content, 'application/xml')
            console.log(document)
        } else if (entry.filename.endsWith('.brp')) {
            const writer = new TextWriter()
            const content = await entry.getData(writer)
            console.log(entry.filename, parseBRep(content))
        }
    }
    await reader.close()
    return new Group()
}