import { Module } from '@nestjs/common'
import { TestModule } from './mqtt/test/test.module'

@Module({
    imports: [TestModule]
})
export class MQTTModule {

}