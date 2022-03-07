import * as fs from 'fs'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FileService {
    async getFile(id: string): Promise<fs.ReadStream> {
        return fs.createReadStream(`./uploads/${id}`)
    }
}
