import { createReadStream, createWriteStream, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from "fs"
import { dirname, join } from "path"

import { Injectable, NotFoundException, StreamableFile } from "@nestjs/common"

import axios from 'axios'
import { Entry, fromBuffer } from 'yauzl'

import { renderLDraw } from "../../../functions/render"

@Injectable()
export class PartService {

    private readonly URL = 'https://library.ldraw.org/library/updates/complete.zip'

    private readonly ASSETS = 'assets'
    private readonly LDRAW = join(this.ASSETS, 'ldraw')

    private readonly paths: {[name: string]: string} = {}

    constructor() {
        this.prepare().then(() => this.index(this.LDRAW))
    }

    private async prepare(): Promise<void> {
        return new Promise<void>(resolve => {
            console.log('Checking LDraw')
            if (!existsSync(this.LDRAW)) {
                console.log('Downloading LDraw')
                axios.get(this.URL, { responseType: 'arraybuffer' }).then(response => {
                    console.log('Unzipping LDraw')
                    fromBuffer(response.data as Buffer, { lazyEntries: true }, (error, file) => {
                        if (error) {
                            console.error(error)
                        } else {
                            file.on('entry', (entry: Entry)  => {
                                console.log(`Creating ${join(this.ASSETS, entry.fileName)}`)
                                if (/\/$/.test(entry.fileName)) {
                                    file.readEntry()
                                } else {
                                    file.openReadStream(entry, (error, istream) => {
                                        if (error) {
                                            console.error(error)
                                        } else {
                                            // Create directories (if necessary)
                                            const path = join(this.ASSETS, dirname(entry.fileName))
                                            if (!existsSync(path)) {
                                                mkdirSync(path, { recursive: true })
                                            }
                                            // Create file
                                            const ostream = createWriteStream(join(this.ASSETS, entry.fileName), { flags: 'w' })
                                            istream.on('end', () => {
                                                file.readEntry()
                                            })
                                            istream.pipe(ostream)
                                        }
                                    })
                                }
                            })
                            file.on('end', () => {
                                resolve()
                            })
                            file.readEntry()
                        }
                    })
                }).catch(error => {
                    console.error(error)
                })
            } else {
                resolve()
            }
        })
    }

    private index(parent: string) {
        console.log(`Indexing ${parent}`)
        for (const name of readdirSync(parent)) {
            const child = join(parent, name)
            if (statSync(child).isDirectory()) {
                this.index(child)
            } else {
                if (!(name in this.paths) || child.length < this.paths[name].length) {
                    this.paths[name] = child
                }
            }
        }
    }

    public async getPart(name: string): Promise<StreamableFile> {
        if (!(name in this.paths)) {
            if (name.endsWith('.png')) {
                const partName = name.replace('.png', '.dat')
                if (partName in this.paths) {
                    console.log(`Rendering ${partName}`)
                    const partPath = this.paths[partName]
                    const partData = readFileSync(partPath, 'utf-8')
                    const imagePath = partPath.replace('.dat', '.png')
                    const imageData = await renderLDraw(partData, 512, 512)
                    await imageData.writeAsync(imagePath)
                    this.paths[name] = imagePath
                }
            }
        }
        if (name in this.paths) {
            const stream = createReadStream(this.paths[name])
            if (name.endsWith('.png')) {
                return new StreamableFile(stream, { type: 'image/png', disposition: 'inline' })
            } else {
                return new StreamableFile(stream)
            }
        }
        throw new NotFoundException()
    }

}