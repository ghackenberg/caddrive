import { Module } from '@nestjs/common'
import { VersionController } from './version.controller'
import { VersionService } from './version.service'
import { MemberModule } from '../members/member.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { VersionEntity } from './version.entity'



@Module({
    controllers: [VersionController],
    providers: [VersionService],
    exports: [VersionService],
    imports:[MemberModule, TypeOrmModule.forFeature([VersionEntity])]
})
export class VersionModule {}