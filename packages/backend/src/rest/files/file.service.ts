import * as fs from 'fs'
import { Injectable } from '@nestjs/common'
import { FileREST } from 'productboard-common'

@Injectable()
export class FileService implements FileREST<fs.ReadStream> {
    async getFile(id: string): Promise<fs.ReadStream> {
        return fs.createReadStream(`./uploads/${id}`)
    }
}
