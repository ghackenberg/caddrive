import { FileREST } from 'productboard-common'

import { FileClient } from '../clients/rest/file'

class FileManagerImpl implements FileREST<ArrayBuffer> {
    private fileIndex: {[id: string]: ArrayBuffer} = {}

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

    getFileFromCache(id: string) {
        if (id in this.fileIndex) {
            return this.fileIndex[id]
        } else {
            return undefined
        }
    }
}

export const FileManager = new FileManagerImpl()