import { Face } from "./face"
import { Hexa } from "./hexa"
import { Node } from "./node"

class Group<T> {
    constructor(public name: string, public objects: T[]) {

    }
}

export class NodeGroup extends Group<Node> {

}
export class MailGroup extends Group<Hexa | Face> {

}