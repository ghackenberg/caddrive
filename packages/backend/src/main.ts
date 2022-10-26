import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppDataSource } from 'productboard-database'
import { MQTTModule } from './modules/mqtt.module'
import { RESTModule } from './modules/rest.module'

async function bootstrap() {
    await AppDataSource.initialize()

    const rest = await NestFactory.create(RESTModule)

    const mqtt = await NestFactory.createMicroservice<MicroserviceOptions>(MQTTModule, {
        transport: Transport.MQTT,
        options: {
            url: 'mqtt://localhost:1883'
        }
    })

    const config = new DocumentBuilder()
        .setTitle('ProductBoard')
        .setDescription('ProductBoard provides a free and open source solution to agile product design.')
        .setVersion('1.0.0')
        .addBasicAuth()
        .build()

    const document = SwaggerModule.createDocument(rest, config)

    SwaggerModule.setup('rest-doc', rest, document)

    rest.listen(3001, () => console.log('REST service listening'))

    mqtt.listen()
}

bootstrap()