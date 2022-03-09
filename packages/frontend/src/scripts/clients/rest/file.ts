import axios from 'axios'
// Commons
import { FileREST } from 'productboard-common'
// Globals
import { auth } from '../auth'

class FileClientImpl implements FileREST<string | ArrayBuffer> {
    async getFile(id: string): Promise<string | ArrayBuffer> {
        return (await axios.get<ArrayBuffer>(`/rest/files/${id}`, { responseType: 'arraybuffer', auth })).data
    }
}

export const FileClient = new FileClientImpl()