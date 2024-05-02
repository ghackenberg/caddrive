import { existsSync, writeFileSync, createReadStream, readFileSync, statSync } from 'fs'

import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common'

import { FileREST } from 'productboard-common'

import { packLDrawText } from '../../../functions/pack'

@Injectable()
export class FileService implements FileREST<StreamableFile> {
    async getFile(fileId: string): Promise<StreamableFile> {
        if (fileId.endsWith('-packed.ldr')) {
            if (!existsSync(`./uploads/${fileId}`)) {
                const original = `./uploads/${fileId.substring(0, fileId.lastIndexOf('-packed.ldr'))}.ldr`
                if (!existsSync(original)) {
                    throw new NotFoundException()
                }
                writeFileSync(`./uploads/${fileId}`, packLDrawText(readFileSync(original, { encoding: 'utf-8' })))
            }
            const stats = statSync(`./uploads/${fileId}`)
            return new StreamableFile(createReadStream(`./uploads/${fileId}`), { length: stats.size })
        } else {
            if (!existsSync(`./uploads/${fileId}`)) {
                throw new NotFoundException()
            }
            return new StreamableFile(createReadStream(`./uploads/${fileId}`))
        }
    }
}
