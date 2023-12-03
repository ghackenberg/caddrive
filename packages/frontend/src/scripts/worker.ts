export const worker = new Worker('/scripts/worker/main.js')

worker.onmessage = event => {
    console.log('frontend', event)
}

worker.postMessage('test')