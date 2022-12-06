import { Injectable } from "@nestjs/common"
import { Client, ClientProxy, Transport } from "@nestjs/microservices"

import { Product, ProductDownMQTT } from "productboard-common"

@Injectable()
export class ProductService implements ProductDownMQTT {

    @Client({ transport: Transport.MQTT })
    private client: ClientProxy

    create(product: Product): void {
        this.client.emit(`/api/v1/products/${product.id}/create`, product)
    }

    update(product: Product): void {
        this.client.emit(`/api/v1/products/${product.id}/update`, product)
    }

    delete(product: Product): void {
        this.client.emit(`/api/v1/products/${product.id}/delete`, product)
    }

}