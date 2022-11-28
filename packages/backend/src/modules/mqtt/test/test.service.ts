import { Client, ClientProxy, Transport } from "@nestjs/microservices"

import { TestDownMQTT } from "productboard-common"

export class TestService implements TestDownMQTT {

    @Client({ transport: Transport.MQTT })
    private client: ClientProxy

    c(data: string): void {
        this.client.emit("c", data)
    }

    d(data: string): void {
        this.client.emit("d", data)
    }

}