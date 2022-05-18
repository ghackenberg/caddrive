import { Module } from '@nestjs/common'
import { VersionController } from './version.controller'
import { VersionService } from './version.service'
import { MemberModule } from '../members/member.module'

@Module({
    controllers: [VersionController],
    providers: [VersionService],
    exports: [VersionService],
    imports:[MemberModule]
})
export class VersionModule {}