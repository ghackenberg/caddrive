import { Module } from '@nestjs/common'

import { TestModule } from './mqtt/test/test.module'
import { UserModule } from './rest/users/user.module'

@Module({
    imports: [TestModule, UserModule]
})
export class MQTTModule {}