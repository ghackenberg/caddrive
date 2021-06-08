import { NestFactory } from '@nestjs/core' 
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    const config = new DocumentBuilder()
        .setTitle('FH OÖ Audit Platform')
        .setDescription('TODO')
        .setVersion('1.0.0')
        .build()

    const document = SwaggerModule.createDocument(app, config)

    SwaggerModule.setup('doc', app, document)

    await app.listen(3001)
}

bootstrap()