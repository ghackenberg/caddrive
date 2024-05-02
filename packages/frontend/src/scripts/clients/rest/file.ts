import axios from 'axios'

import { FileREST } from 'productboard-common'

import { auth } from '../auth'

class FileClientImpl implements FileREST<ArrayBuffer> {
    async getFile(fileId: string): Promise<ArrayBuffer> {
        return (await axios.get<ArrayBuffer>(`/rest/files/${fileId}`, { responseType: 'arraybuffer', ...auth })).data
    }
}

export const FileClient = new FileClientImpl()