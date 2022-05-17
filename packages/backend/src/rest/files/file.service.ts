import * as fs from 'fs'
import { Injectable, NotFoundException } from '@nestjs/common'
import { FileREST } from 'productboard-common'

@Injectable()
export class FileService implements FileREST<fs.ReadStream> {
    async getFile(id: string): Promise<fs.ReadStream> {
        if (fs.existsSync(`./uploads/${id}`)) {
            return fs.createReadStream(`./uploads/${id}`)
        } else {
            throw new NotFoundException()
        }
    }
}
