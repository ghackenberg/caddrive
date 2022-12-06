import { Injectable } from "@nestjs/common"
import { Client, ClientProxy, Transport } from "@nestjs/microservices"

import { Version, VersionDownMQTT } from "productboard-common"

@Injectable()
export class VersionService implements VersionDownMQTT {

    @Client({ transport: Transport.MQTT })
    private client: ClientProxy

    create(version: Version): void {
        this.client.emit(`/api/v1/users/$version.id}/create`,version)
    }

    update(version: Version): void {
        this.client.emit(`/api/v1/users/$version.id}/update`,version)
    }

    delete(version: Version): void {
        this.client.emit(`/api/v1/users/$version.id}/delete`,version)
    }

}