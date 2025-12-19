import { Face } from "./face.js"
import { Hexa } from "./hexa.js"
import { Node } from "./node.js"

class Group<T> {
    constructor(public name: string, public objects: T[]) {

    }
}

export class NodeGroup extends Group<Node> {

}
export class MailGroup extends Group<Hexa | Face> {

}