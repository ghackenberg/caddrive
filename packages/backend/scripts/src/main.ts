import { existsSync, mkdirSync, readFileSync } from 'fs'

import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import compression from 'compression'
import { json, NextFunction, Request, Response, urlencoded } from 'express'
import Jimp from 'jimp'
import { IsNull } from 'typeorm'

import { Database } from 'productboard-database'

import './mqtt'
import { renderGlb, renderLDraw } from './functions/render'
import { RESTModule } from './modules/rest.module'

async function bootstrap() {
    console.log(new Date(), 'Initializing upload folder (if necessary)')

    if (!existsSync('./uploads')) {
        mkdirSync('./uploads')
    }

    console.log(new Date(), 'Initializing database')

    await Database.init()

    console.log(new Date(), 'Initializing REST module')

    const rest = await NestFactory.create(RESTModule)

    console.log(new Date(), 'Initializing REST middleware')

    rest.use(json({
        limit: '1mb'
    }))
    rest.use(urlencoded({
        limit: '5mb', extended: true
    }))
    rest.use(compression({
        filter: request => request.url.endsWith('.ldr') || request.url.endsWith('.mpd')
    }))
    rest.use((request: Request, _response: Response, next: NextFunction) => {
        console.log(new Date(), request.url)
        next()
    })

    console.log(new Date(), 'Initializing SWAGGER documentation')

    const config = new DocumentBuilder()
        .setTitle('ProductBoard')
        .setDescription('ProductBoard provides a free and open source solution to agile product design.')
        .setVersion('1.0.0')
        .addBasicAuth()
        .build()

    const document = SwaggerModule.createDocument(rest, config)

    SwaggerModule.setup('rest-doc', rest, document)

    console.log(new Date(), 'Initializing port listener')

    rest.listen(3001, () => { console.log(new Date(), 'REST service listening'); fix() })
}

async function fix() {
    console.log(new Date(), 'Fixing version images (if necessary)')
    
    const versions = await Database.get().versionRepository.findBy({ deleted: IsNull(), imageType: IsNull() })
    for (const version of versions) {
        try {
            console.warn(new Date(), 'Version image does not exist. Rendering it!', version.productId, version.versionId)
            const file = `./uploads/${version.versionId}.${version.modelType}`
            if (version.modelType == 'glb') {
                const model = readFileSync(file)
                const image = await renderGlb(model, 1000, 1000)
                await updateImage(version.productId, version.versionId, image)
            } else if (version.modelType == 'ldr') {
                const model = readFileSync(file, 'utf-8')
                const image = await renderLDraw(model, 1000, 1000)
                await updateImage(version.productId, version.versionId, image)
            } else if (version.modelType == 'mpd') {
                const model = readFileSync(file, 'utf-8')
                const image = await renderLDraw(model, 1000, 1000)
                await updateImage(version.productId, version.versionId, image)
            } else {
                console.error(new Date(), 'Version model type not supported:', version.modelType)
            }
        } catch (e) {
            console.error(new Date(), 'Could not render version image', e)
        }
    }
}

async function updateImage(productId: string, versionId: string, image: Jimp) {
    // Save image
    await image.writeAsync(`./uploads/${versionId}.png`)
    // Update version
    const version = await Database.get().versionRepository.findOneBy({ productId, versionId })
    version.updated = Date.now()
    version.imageType = 'png'
    await Database.get().versionRepository.save(version)
    // Update product
    const product = await Database.get().productRepository.findOneBy({ productId })
    product.updated = version.updated
    await Database.get().productRepository.save(product)
}

bootstrap()