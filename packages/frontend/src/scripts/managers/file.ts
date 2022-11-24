import { FileREST } from 'productboard-common'

import { FileClient } from '../clients/rest/file'

class FileManagerImpl implements FileREST<string | ArrayBuffer> {
    private fileIndex: {[id: string]: string | ArrayBuffer} = {}

    async getFile(id: string): Promise<string | ArrayBuffer> {
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