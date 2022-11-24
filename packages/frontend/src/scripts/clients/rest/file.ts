import axios from 'axios'

import { FileREST } from 'productboard-common'

import { auth } from '../auth'

class FileClientImpl implements FileREST<string | ArrayBuffer> {
    async getFile(id: string): Promise<string | ArrayBuffer> {
        return (await axios.get<ArrayBuffer>(`/rest/files/${id}`, { responseType: 'arraybuffer', auth })).data
    }
}

export const FileClient = new FileClientImpl()