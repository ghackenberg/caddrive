import { existsSync, writeFileSync, createReadStream, ReadStream, readFileSync } from 'fs'

import { Injectable, NotFoundException } from '@nestjs/common'

import { FileREST } from 'productboard-common'

import { packLDrawText } from '../../../functions/pack'

@Injectable()
export class FileService implements FileREST<ReadStream> {
    async getFile(fileId: string): Promise<ReadStream> {
        if (fileId.endsWith('-packed.ldr')) {
            if (!existsSync(`./uploads/${fileId}`)) {
                const original = `./uploads/${fileId.substring(0, fileId.lastIndexOf('-packed.ldr'))}.ldr`
                if (!existsSync(original)) {
                    throw new NotFoundException()
                }
                writeFileSync(`./uploads/${fileId}`, packLDrawText(readFileSync(original, { encoding: 'utf-8' })))
            }
            return createReadStream(`./uploads/${fileId}`)
        } else {
            if (!existsSync(`./uploads/${fileId}`)) {
                throw new NotFoundException()
            }
            return createReadStream(`./uploads/${fileId}`)
        }
    }
}
