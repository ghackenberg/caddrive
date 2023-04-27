import { Injectable } from "@nestjs/common"
import { Client, ClientProxy, Transport } from "@nestjs/microservices"

import { Comment, CommentDownMQTT } from "productboard-common"

@Injectable()
export class CommentService implements CommentDownMQTT {

    @Client({ transport: Transport.MQTT })
    private client: ClientProxy

    create(comment: Comment): void {
        this.client.emit(`/api/v1/users/$comment.id}/create`,comment)
    }

    update(comment: Comment): void {
        this.client.emit(`/api/v1/users/$comment.id}/update`,comment)
    }

    delete(comment: Comment): void {
        this.client.emit(`/api/v1/users/$comment.id}/delete`,comment)
    }

}