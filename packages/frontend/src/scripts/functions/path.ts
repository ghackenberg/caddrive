import { Object3D } from "three"

export function computePath(object: Object3D) {
    let path = ''
    while (object.parent.type != 'Scene') {
        const index = object.parent.children.indexOf(object)
        path = path ? `${index}-${path}` : `${index}`
        object = object.parent
    }
    return path ? `0-${path}` : '0'
}