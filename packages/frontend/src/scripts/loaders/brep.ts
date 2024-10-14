import { worker } from "../worker"

export function parseBRep(content: string): Promise<Uint8Array> {
    return new Promise<Uint8Array>((resolve, reject) => {
        // Define handlers
        function handleMessage(message: MessageEvent) {
            worker.removeEventListener('message', handleMessage)
            worker.removeEventListener('messageerror', handleMessageError)
            worker.removeEventListener('error', handleError)
            if (message.data instanceof Uint8Array) {
                resolve(message.data)
            } else {
                reject('Return message data type unexpected: ' + message.data)
            }
        }
        function handleMessageError(message: MessageEvent) {
            worker.removeEventListener('message', handleMessage)
            worker.removeEventListener('messageerror', handleMessageError)
            worker.removeEventListener('error', handleError)
            reject(message)
        }
        function handleError(error: ErrorEvent) {
            worker.removeEventListener('message', handleMessage)
            worker.removeEventListener('messageerror', handleMessageError)
            worker.removeEventListener('error', handleError)
            reject(error)
        }
        // Add handlers
        worker.addEventListener('message', handleMessage)
        worker.addEventListener('messageerror', handleMessageError)
        worker.addEventListener('error', handleError)
        // Post message
        worker.postMessage('brp')
        worker.postMessage(content)
    })
}