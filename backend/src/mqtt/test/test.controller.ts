import { Controller } from '@nestjs/common'
import { Client, ClientProxy, Ctx, MessagePattern, MqttContext, Payload, Transport } from '@nestjs/microservices'
import { TestMQTT } from 'fhooe-audit-platform-common'

@Controller()
export class TestController implements TestMQTT {
    @Client({ transport: Transport.MQTT })
    private client: ClientProxy

    @MessagePattern('a')
    async a(@Payload() data: string) {
        console.log(`A received ${data}`)
        this.client.emit('b', data)
    }

    @MessagePattern('b')
    async b(@Payload() data: string) {
        console.log(`B received ${data}`)
    }
}