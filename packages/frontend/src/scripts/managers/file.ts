import { FileREST } from 'productboard-common'

import { FileClient } from '../clients/rest/file'

class FileManagerImpl implements FileREST<ArrayBuffer> {
    private fileIndex: {[id: string]: ArrayBuffer} = {}

    // CACHE

    clear() {
        this.fileIndex = {}
    }

    getFileFromCache(id: string) {
        if (id in this.fileIndex) {
            return this.fileIndex[id]
        } else {
            return undefined
        }
    }

    // REST

    async getFile(id: string): Promise<ArrayBuffer> {
        if (!(id in this.fileIndex)) {
            // Call backend
            const file = await FileClient.getFile(id)
            // Update file index
            this.fileIndex[id] = file
        }
        // Return file
        return this.fileIndex[id]
    }
}

export const FileManager = new FileManagerImpl()