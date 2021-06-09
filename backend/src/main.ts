import { NestFactory } from '@nestjs/core' 
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { MQTTModule } from './mqtt.module'
import { RESTModule } from './rest.module'

async function bootstrap() {
    const rest = await NestFactory.create(RESTModule)
    const mqtt = await NestFactory.createMicroservice<MicroserviceOptions>(MQTTModule, {
        transport: Transport.MQTT,
        options: {
            url: 'mqtt://localhost:1883'
        }
    })

    const config = new DocumentBuilder()
        .setTitle('FH OÖ Audit Platform')
        .setDescription('TODO')
        .setVersion('1.0.0')
        .build()

    const document = SwaggerModule.createDocument(rest, config)

    SwaggerModule.setup('rest-doc', rest, document)

    rest.listen(3001, () => console.log('REST service listening'))
    mqtt.listen(() => console.log('MQTT service listening'))
}

bootstrap()