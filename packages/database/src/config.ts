import { DataSource, DataSourceOptions } from 'typeorm'

const synchronize = false
const logging = false

const entities = ["../database/src/entities/*.ts"]
const subscribers = ["../database/src/subscribers/*.ts"]
const migrations = ["../database/src/migrations/*.ts"]

const type = process.env['TYPEORM_TYPE'] || 'sqlite'

let options: DataSourceOptions = null

if (type == 'postgres') {

    const host = process.env['TYPEORM_HOST'] || 'localhost'
    const port = parseInt(process.env['TYPEORM_PORT'] || '5432')

    const database = process.env['TYPEORM_DATABASE'] || 'postgres'
    const username = process.env['TYPEORM_USERNAME'] || 'postgres'
    const password = process.env['TYPEORM_PASSWORD'] || 'test'

    options = {
        type,
        host,
        port,
        database,
        username,
        password,
        synchronize,
        logging,
        entities,
        subscribers,
        migrations
    }

} else if (type == 'sqlite') {

    const database = process.env['TYPEORM_DATABASE'] || '../../database.sqlite'

    options = {
        type,
        database,
        synchronize,
        logging,
        entities,
        subscribers,
        migrations
    }

} else {

    throw 'Database type not supported!'

}

export default new DataSource(options)