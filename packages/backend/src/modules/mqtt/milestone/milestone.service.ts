import { Injectable } from "@nestjs/common"
import { Client, ClientProxy, Transport } from "@nestjs/microservices"

import { Milestone, MilestoneDownMQTT } from "productboard-common"

@Injectable()
export class MilestoneService implements MilestoneDownMQTT {

    @Client({ transport: Transport.MQTT })
    private client: ClientProxy

    create(milestone: Milestone): void {
        this.client.emit(`/api/v1/users/$milestone.id}/create`,milestone)
    }

    update(milestone: Milestone): void {
        this.client.emit(`/api/v1/users/$milestone.id}/update`,milestone)
    }

    delete(milestone: Milestone): void {
        this.client.emit(`/api/v1/users/$milestone.id}/delete`,milestone)
    }

}