import { EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, MeshPhongMaterial } from 'three'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'

import { CacheAPI } from '../clients/cache'

const TEXT_DECODER = new TextDecoder()

const PLY_LOADER = new PLYLoader()

export async function loadPLYModel(path: string) {
    const file = await CacheAPI.loadFile(path)
    const text = TEXT_DECODER.decode(file)
    return parsePLYModel(text)
}

export async function parsePLYModel(data: string) {
    const face_geometry = PLY_LOADER.parse(data)
    
    face_geometry.computeVertexNormals()

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