import { Injectable } from "@nestjs/common"
import { Client, ClientProxy, Transport } from "@nestjs/microservices"

import { User, UserDownMQTT } from "productboard-common"

@Injectable()
export class UserService implements UserDownMQTT {

    @Client({ transport: Transport.MQTT })
    private client: ClientProxy

    create(user: User): void {
        this.client.emit(`/api/v1/users/${user.id}/create`, user)
    }

    update(user: User): void {
        this.client.emit(`/api/v1/users/${user.id}/update`, user)
    }

    delete(user: User): void {
        this.client.emit(`/api/v1/users/${user.id}/delete`, user)
    }

}