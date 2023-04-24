import { exit } from 'process'

import { Database } from 'productboard-database'

async function drop() {
    await Database.init()
    console.log('Drop: init')
    await Database.get().dataSource.dropDatabase()
    console.log('Drop: dataSource.dropDatabase')
    await Database.get().dataSource.destroy()  
    console.log('Drop: dataSourcce.destroy')
}

async function init() {
    await Database.init()
    console.log('Init: init')
    await Database.get().dataSource.destroy()  
    console.log('Init: dataSource.destroy')
}
async function main() {
    await drop()
    await init()
    exit()
}

main()