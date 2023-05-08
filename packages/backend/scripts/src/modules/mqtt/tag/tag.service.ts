import { Injectable } from "@nestjs/common"
import { Client, ClientProxy, Transport } from "@nestjs/microservices"

import { Tag, TagDownMQTT } from "productboard-common"

@Injectable()
export class TagService implements TagDownMQTT {

    @Client({ transport: Transport.MQTT })
    private client: ClientProxy

    create(tag: Tag): void {
        this.client.emit(`/api/v1/users/$tag.id}/create`, tag)
    }

    update(tag: Tag): void {
        this.client.emit(`/api/v1/users/$tag.id}/update`, tag)
    }

    delete(tag: Tag): void {
        this.client.emit(`/api/v1/users/$tag.id}/delete`, tag)
    }

}