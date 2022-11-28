import { Controller } from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

import { TestUpMQTT } from 'productboard-common'

@Controller()
export class TestController implements TestUpMQTT {
    @MessagePattern('a')
    async a(@Payload() data: string) {
        console.log(`A received ${data}`)
    }

    @MessagePattern('b')
    async b(@Payload() data: string) {
        console.log(`B received ${data}`)
    }
}