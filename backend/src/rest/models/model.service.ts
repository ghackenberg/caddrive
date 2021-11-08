import * as fs from 'fs'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ModelService {
    async getModel(id: string): Promise<fs.ReadStream> {
        return fs.createReadStream(`./uploads/${id}.glb`)
    }
}
