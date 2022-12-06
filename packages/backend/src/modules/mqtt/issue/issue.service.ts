import { Injectable } from "@nestjs/common"
import { Client, ClientProxy, Transport } from "@nestjs/microservices"

import { Issue, IssueDownMQTT } from "productboard-common"

@Injectable()
export class IssueService implements IssueDownMQTT {

    @Client({ transport: Transport.MQTT })
    private client: ClientProxy

    create(issue: Issue): void {
        this.client.emit(`/api/v1/users/$issue.id}/create`,issue)
    }

    update(issue: Issue): void {
        this.client.emit(`/api/v1/users/$issue.id}/update`,issue)
    }

    delete(issue: Issue): void {
        this.client.emit(`/api/v1/users/$issue.id}/delete`,issue)
    }

}