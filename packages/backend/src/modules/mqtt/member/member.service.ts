import { Injectable } from "@nestjs/common"
import { Client, ClientProxy, Transport } from "@nestjs/microservices"

import { Member, MemberDownMQTT } from "productboard-common"

@Injectable()
export class MemberService implements MemberDownMQTT {

    @Client({ transport: Transport.MQTT })
    private client: ClientProxy

    create(member: Member): void {
        this.client.emit(`/api/v1/users/$member.id}/create`,member)
    }

    update(member: Member): void {
        this.client.emit(`/api/v1/users/$member.id}/update`,member)
    }

    delete(member: Member): void {
        this.client.emit(`/api/v1/users/$member.id}/delete`,member)
    }

}