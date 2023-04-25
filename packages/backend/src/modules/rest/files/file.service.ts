import { existsSync, createReadStream, ReadStream } from 'fs'

import { Injectable, NotFoundException } from '@nestjs/common'

import { FileREST } from 'productboard-common'

@Injectable()
export class FileService implements FileREST<ReadStream> {
    async getFile(id: string): Promise<ReadStream> {
        if (!existsSync(`./uploads/${id}`)) {
            throw new NotFoundException()
        }
        return createReadStream(`./uploads/${id}`)
    }
}
