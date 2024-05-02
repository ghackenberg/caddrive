import { ProductMessageData, UserMessageData, compileProductMessage, compileUserMessage } from "productboard-database"

import { MqttAPI } from "../mqtt"

export async function emitUserMessage(userId: string, data: UserMessageData) {
    const message = compileUserMessage(data);
    (await MqttAPI).publish(`/users/${userId}`, JSON.stringify(message))
}
export async function emitProductMessage(productId: string, data: ProductMessageData) {
    const message = compileProductMessage(data);
    (await MqttAPI).publish(`/products/${productId}`, JSON.stringify(message))
}