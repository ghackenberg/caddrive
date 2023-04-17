import { createWriteStream, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'

import { Module, OnApplicationBootstrap } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'

import axios from 'axios'
import { Entry, fromBuffer } from 'yauzl'

import { CommentModule } from './rest/comments/comment.module'
import { FileModule } from './rest/files/file.module'
import { IssueModule } from './rest/issues/issue.module'
import { MemberModule } from './rest/members/member.module'
import { MilestoneModule } from './rest/milestones/milestone.module'
import { ProductModule } from './rest/products/product.module'
import { UserModule } from './rest/users/user.module'
import { VersionModule } from './rest/versions/version.module'

@Module({
    imports: [UserModule, ProductModule, VersionModule, IssueModule, CommentModule, FileModule, MilestoneModule, MemberModule, ServeStaticModule.forRoot({
        rootPath: './static'
    })]
})
export class RESTModule implements OnApplicationBootstrap {
    onApplicationBootstrap() {
        if (!existsSync('./static/assets/ldraw')) {
            console.log('Downloading LDraw')
            axios.get('https://library.ldraw.org/library/updates/complete.zip', { responseType: 'arraybuffer' }).then(response => {
                console.log('Unzipping LDraw')
                fromBuffer(response.data as Buffer, { lazyEntries: true }, (error, file) => {
                    if (error) {
                        console.error(error)
                    } else {
                        file.on('entry', (entry: Entry)  => {
                            console.log(`Creating ./static/assets/${entry.fileName}`)
                            if (/\/$/.test(entry.fileName)) {
                                file.readEntry()
                            } else {
                                file.openReadStream(entry, (error, istream) => {
                                    if (error) {
                                        console.error(error)
                                    } else {
                                        const path = join('./static/assets', dirname(entry.fileName))
                                        if (!existsSync(path)) {
                                            mkdirSync(path, { recursive: true })
                                        }
                                        const ostream = createWriteStream(join('./static/assets', entry.fileName), { flags: 'w' })
                                        istream.on('end', () => {
                                            file.readEntry()
                                        })
                                        istream.pipe(ostream)
                                    }
                                })
                            }
                        })
                        file.readEntry()
                    }
                })
            }).catch(error => {
                console.error(error)
            })
        }
    }
}