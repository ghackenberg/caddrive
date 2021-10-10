import { Module } from '@nestjs/common'
import { ProductModule } from '../products/product.module'
import { VersionController } from './version.controller'
import { VersionService } from './version.service'

@Module({
    controllers: [VersionController],
    providers: [VersionService],
    imports: [ProductModule],
    exports: [VersionService]
})
export class VersionModule {

}