import { EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, MeshPhongMaterial } from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

import { CacheAPI } from '../clients/cache'

const loader = new STLLoader()

export async function loadSTLModel(path: string) {
    const file = await CacheAPI.loadFile(path)
    return parseSTLModel(file)
}

export async function parseSTLModel(data: ArrayBuffer) {
    const face_geometry = loader.parse(data)
    const face_material = new MeshPhongMaterial({ color: 'orange' })

    const edge_geometry = new EdgesGeometry(face_geometry.clone(), 45)
    const edge_material = new LineBasicMaterial({ color: 'yellow' })

    const face_mesh = new Mesh(face_geometry, face_material)
    const edge_mesh = new LineSegments(edge_geometry, edge_material)

    const group = new Group()
    group.add(edge_mesh)
    group.add(face_mesh)

    return group
}