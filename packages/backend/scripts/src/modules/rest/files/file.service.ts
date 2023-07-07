import { existsSync, createReadStream, ReadStream } from 'fs'

import { Injectable, NotFoundException } from '@nestjs/common'

import { FileREST } from 'productboard-common'

@Injectable()
export class FileService implements FileREST<ReadStream> {
    async getFile(fileId: string): Promise<ReadStream> {
        if (!existsSync(`./uploads/${fileId}`)) {
            throw new NotFoundException()
        }
        return createReadStream(`./uploads/${fileId}`)
    }
}
