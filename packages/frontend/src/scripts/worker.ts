export const worker = new Worker('/scripts/worker/main.js')

worker.addEventListener('message', event => {
    console.log(event.data)
})

worker.addEventListener('messageerror', event => {
    console.error(event.data)
})

worker.addEventListener('error', event => {
    console.error(event.error)
})