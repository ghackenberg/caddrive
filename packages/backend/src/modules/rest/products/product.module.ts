import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService],
    imports: [ClientsModule.register([{ name: 'MQTT', transport: Transport.MQTT }])]
})
export class ProductModule {}