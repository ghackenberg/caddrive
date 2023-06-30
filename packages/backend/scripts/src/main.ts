import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { Database } from 'productboard-database'

import './mqtt'
import { RESTModule } from './modules/rest.module'

async function bootstrap() {
    await Database.init()

    const rest = await NestFactory.create(RESTModule)

    const config = new DocumentBuilder()
        .setTitle('ProductBoard')
        .setDescription('ProductBoard provides a free and open source solution to agile product design.')
        .setVersion('1.0.0')
        .addBasicAuth()
        .build()

    const document = SwaggerModule.createDocument(rest, config)

    SwaggerModule.setup('rest-doc', rest, document)

    rest.listen(3001, () => console.log('REST service listening'))
}

bootstrap()