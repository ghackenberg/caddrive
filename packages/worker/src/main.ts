console.log('Worker is running!')

onmessage = event => {
    console.log('worker', event)
    postMessage({ payload: 'test' })
}