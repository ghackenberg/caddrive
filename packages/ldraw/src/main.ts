import { Group } from 'three'
import { LDrawLoader } from 'three/examples/jsm/loaders/LDrawLoader'

export * from './model'
export * from './parser'

export interface CustomLDrawModelPart {
    id: string
    name: string
    color: string
    position: { x: number, y: number, z: number }
    orientation: number[]
}

export type CustomLDrawModel = CustomLDrawModelPart[]

class Operation {

}
// TODO Move operations here

export async function parseCustomLDrawModel(LDRAW_LOADER: LDrawLoader, MATERIAL_LOADING: Promise<void>, data: string): Promise<Group> {
    await MATERIAL_LOADING

    const group = new Group()

    const model = JSON.parse(data) as CustomLDrawModel

    for (const child of model) {
        const color = child.color

        const x = child.position.x
        const y = child.position.y
        const z = child.position.z

        const a = child.orientation[0]
        const b = child.orientation[1]
        const c = child.orientation[2]
        const d = child.orientation[4]
        const e = child.orientation[5]
        const f = child.orientation[6]
        const g = child.orientation[8]
        const h = child.orientation[9]
        const i = child.orientation[10]

        const name = child.name

        const ldraw = `1 ${color} ${x} ${y} ${z} ${a} ${b} ${c} ${d} ${e} ${f} ${g} ${h} ${i} ${name}`
    
        await new Promise<void>(resolve => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (LDRAW_LOADER as any).parse(ldraw, (subgroup: Group) => {
                for (const part of subgroup.children) {
                    group.add(part.clone(true))
                }
                resolve()
            })
        })
    }

    group.rotation.x = Math.PI

    return group
}

export async function parseCustomLDrawDelta(data: string): Promise<Operation> {
    console.log(data)
    // TODO
    return null
}