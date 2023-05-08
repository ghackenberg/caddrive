import { Injectable } from "@nestjs/common"
import { Client, ClientProxy, Transport } from "@nestjs/microservices"

import { TagAssignment, TagAssignmentDownMQTT } from "productboard-common"

@Injectable()
export class TagAssignmentService implements TagAssignmentDownMQTT {

    @Client({ transport: Transport.MQTT })
    private client: ClientProxy

    create(tagAssignment: TagAssignment): void {
        this.client.emit(`/api/v1/users/$tagAssignment.id}/create`, tagAssignment)
    }

    update(tagAssignment: TagAssignment): void {
        this.client.emit(`/api/v1/users/$tagAssignment.id}/update`, tagAssignment)
    }

    delete(tagAssignment: TagAssignment): void {
        this.client.emit(`/api/v1/users/$tagAssignment.id}/delete`, tagAssignment)
    }

}