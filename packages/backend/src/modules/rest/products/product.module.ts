import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
    imports: [ClientsModule.register([{ name: 'MQTT', transport: Transport.MQTT }])],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService]
})
export class ProductModule {}