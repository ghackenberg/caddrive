import { BlobReader, Entry, TextWriter, Uint8ArrayWriter, ZipReader } from '@zip.js/zip.js'
import { Color, Group, Mesh, MeshStandardMaterial, Object3D } from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const GLTF = new GLTFLoader()

export class FreeCADDocument {
    public label: string
    public objects: {[name: string]: FreeCADObject} = {}
}

export class FreeCADObject {
    public parents: { property: string, object: FreeCADObject }[] = []

    public subtractions: FreeCADObject[]
    public shapes: FreeCADObject[]
    public filter: FreeCADObject[]
    public group: FreeCADObject[]
    public origin_features: FreeCADObject[]

    public origin: FreeCADObject
    public mesh: FreeCADObject
    public tool: FreeCADObject
    public profile: FreeCADObject
    public base: FreeCADObject
    public shape: FreeCADObject

    public label: string
    public visibility: boolean

    public brep: string

    constructor(public name: string, public type: string) {}

    isVisible() {
        if (this.brep) {
            return this.visibility === undefined || this.visibility
        } else {
            for (const child of this.group || []) {
                if (child.isVisible()) {
                    return true
                }
            }
            return false
        }
    }
}

function traverse(object: Object3D, material: MeshStandardMaterial) {
    if (object instanceof Mesh) {
        object.material = material
    }
    for (const child of object.children) {
        traverse(child, material)
    }
}

export async function parseFCStdModel(data: ReadableStream | BlobReader, brep2Glb: (content: string) => Promise<Uint8Array>) {
    // Data stuctures
    const colors: {[name: string]: MeshStandardMaterial[]} = {}
    const breps: {[name: string]: Entry} = {}
    const gltfs: {[name: string]: GLTF} = {}
    // Main document
    let doc: FreeCADDocument
    // Read ZIP file
    const reader = new ZipReader(data)
    const entries = await reader.getEntries()
    for (const entry of entries) {
        if (entry.filename == 'Document.xml') {
            // Read main document
            const writer = new TextWriter()
            const content = await entry.getData(writer)
            const parser = new DOMParser()
            const document = parser.parseFromString(content, 'application/xml')
            doc = parseFCStdDocument(document)
        } else if (entry.filename.startsWith('DiffuseColor')) {
            // Read color specification
            const writer = new Uint8ArrayWriter()
            const content = await entry.getData(writer)
            colors[entry.filename] = []
            for (let i = 1; i < content.length / 4; i++) {
                const a = 1 - content[i * 4 + 0] / 255
                const b = 1 - content[i * 4 + 1] / 255
                const g = 1 - content[i * 4 + 2] / 255
                const r = 1 - content[i * 4 + 3] / 255
                const color = new Color(r, g, b)
                const material = new MeshStandardMaterial({ color, opacity: a })
                colors[entry.filename].push(material)
            }
        } else if (entry.filename.endsWith('.brp')) {
            // Remember brep entry
            breps[entry.filename] = entry
        }
    }
    await reader.close()
    // Delete objects with parents
    for (const object of Object.values(doc.objects)) {
        if (object.parents.length > 0) {
            delete doc.objects[object.name]
        }
    }
    // Convert to THREEJS
    const model = new Group()
    model.name = doc.label
    model.rotateX(-Math.PI / 2)
    for (const obj of Object.values(doc.objects)) {
        if (obj.isVisible()) {
            model.add(await convertFCObject(obj, colors, breps, gltfs, brep2Glb))
        }
    }
    return model
}

async function convertFCObject(obj: FreeCADObject, colors: {[name: string]: MeshStandardMaterial[]}, breps: {[name: string]: Entry}, gltfs: {[name: string]: GLTF}, brep2Glb: (content: string) => Promise<Uint8Array>) {
    const container = new Group()
    container.name = obj.label
    if (obj.brep) {
        try {
            const file = obj.brep
            // Parse brep
            if (!(file in gltfs)) {
                const entry = breps[obj.brep]
                const writer = new TextWriter()
                const content = await entry.getData(writer)
                console.log('Converting', file)
                const data = await brep2Glb(content)
                console.log('Parsing', file)
                gltfs[file] = await new Promise<GLTF>((resolve, reject) => {
                    GLTF.parse(data.buffer, undefined, resolve, reject)
                })
            }
            // Clone scene
            const face = gltfs[file].scene.clone(true)
            const wire = gltfs[file].scene.clone(true)
            // Update mesh materials
            const other = file.replace('PartShape', 'DiffuseColor').replace('.brp', '')
            if (other in colors) {
                const material = colors[other][0]
                traverse(face, material)
            }
            traverse(wire, new MeshStandardMaterial({ color: 'black', wireframe: true }))
            // Add scene objects
            container.add(face)
            container.add(wire)
        } catch (e) {
            console.log(e)
        }
    } else if (obj.group) {
        for (const child of obj.group) {
            if (child.isVisible()) {
                container.add(await convertFCObject(child, colors, breps, gltfs, brep2Glb))
            }
        }
    }
    return container
}

function parseFCStdDocument(data: Document) {
    const doc = new FreeCADDocument()
    
    parseFCStdDocumentProperties(data, doc)
    parseFCStdDocumentObjects(data, doc)
    parseFCStdDocumentObjectData(data, doc)

    return doc
}

function parseFCStdDocumentProperties(data: Document, doc: FreeCADDocument) {
    const properties = data.getElementsByTagName('Properties')[0]

    // Parse properties
    const property_list = properties.getElementsByTagName('Property')

    for (let i = 0; i < property_list.length; i++) {
        const property = property_list.item(i)

        parseFCStdDocumentProperty(property, doc)
    }
}

function parseFCStdDocumentProperty(data: Element, doc: FreeCADDocument) {
    const name = data.getAttribute('name')

    if (name == 'Label') {
        const child = data.getElementsByTagName('String')[0]
        doc.label = child.getAttribute('value')
    }
}

function parseFCStdDocumentObjects(data: Document, doc: FreeCADDocument) {
    const objects = data.getElementsByTagName('Objects')[0]

    // Parse objects
    const object_list = objects.getElementsByTagName('Object')

    for (let i = 0; i < object_list.length; i++) {
        const object = object_list.item(i)
        const object_name = object.getAttribute('name')
        const object_type = object.getAttribute('type')

        doc.objects[object_name] = new FreeCADObject(object_name, object_type)
    }
}

function parseFCStdDocumentObjectData(data: Document, doc: FreeCADDocument) {
    const objectdata = data.getElementsByTagName('ObjectData')[0]
    const object_list = objectdata.getElementsByTagName('Object')

    for (let i = 0; i < object_list.length; i++) {
        const object = object_list.item(i)
        const object_name = object.getAttribute('name')

        const properties = object.getElementsByTagName('Properties')[0]
        const property_list = properties.getElementsByTagName('Property')

        for (let j = 0; j < property_list.length; j++) {
            const property = property_list.item(j)

            parseFCStdDocumentObjectProperty(property, doc.objects[object_name], doc)
        }
    }
}

function parseFCStdDocumentObjectProperty(data: Element, obj: FreeCADObject, doc: FreeCADDocument) {
    const name = data.getAttribute('name')
    const type = data.getAttribute('type')
    try {
        if (name == 'Label') {
            const child = data.getElementsByTagName('String')[0]
            obj.label = child.getAttribute('value')
        } else if (name == 'Shape') {
            if (type == 'Part::PropertyPartShape') {
                const child = data.getElementsByTagName('Part')[0]
                obj.brep = child.getAttribute('file')
            } else if (type == 'App::PropertyLink') {
                const child = data.getElementsByTagName('LinkSub')[0]
                const other = doc.objects[child.getAttribute('value')]
                if (other) {
                    obj.shape = other
                    other.parents.push({ property: name, object: obj })
                }
            } else {
                console.log(name, type, data)
            }
        } else if (name == 'Visibility') {
            const child = data.getElementsByTagName('Bool')[0]
            obj.visibility = (child.getAttribute('value') == 'true')
        } else if (name == 'Profile') {
            if (type == 'App::PropertyLinkSub') {
                const child = data.getElementsByTagName('LinkSub')[0]
                const other = doc.objects[child.getAttribute('value')]
                if (other) {
                    obj.profile = other
                    other.parents.push({ property: name, object: obj })
                }
            } else {
                console.log(name, type, data)
            }
        } else if (name == 'Base') {
            if (type == 'App::PropertyLink') {
                const child = data.getElementsByTagName('Link')[0]
                const other = doc.objects[child.getAttribute('value')]
                if (other) {
                    obj.base = other
                    other.parents.push({ property: name, object: obj })
                }
            } else {
                console.log(name, type, data)
            }
        } else if (name == 'Tool') {
            const child = data.getElementsByTagName('Link')[0]
            const other = doc.objects[child.getAttribute('value')]
            if (other) {
                obj.tool = other
                other.parents.push({ property: name, object: obj })
            }
        } else if (name == 'Mesh') {
            const child = data.getElementsByTagName('Link')[0]
            const other = doc.objects[child.getAttribute('value')]
            if (other) {
                obj.mesh = other
                other.parents.push({ property: name, object: obj })
            }
        } else if (name == 'Origin') {
            const child = data.getElementsByTagName('Link')[0]
            const other = doc.objects[child.getAttribute('value')]
            if (other) {
                obj.origin = other
                other.parents.push({ property: name, object: obj })
            }
        } else if (name == 'Group') {
            obj.group = []
            const child = data.getElementsByTagName('LinkList')[0]
            const grandchild = child.getElementsByTagName('Link')
            for (let i = 0; i < grandchild.length; i++) {
                const other = doc.objects[grandchild.item(i).getAttribute('value')]
                obj.group.push(other)
                other.parents.push({ property: name, object: obj })
            }
        } else if (name == 'Subtractions') {
            obj.subtractions = []
            const child = data.getElementsByTagName('LinkList')[0]
            const grandchild = child.getElementsByTagName('Link')
            for (let i = 0; i < grandchild.length; i++) {
                const other = doc.objects[grandchild.item(i).getAttribute('value')]
                obj.subtractions.push(other)
                other.parents.push({ property: name, object: obj })
            }
        } else if (name == 'Shapes') {
            obj.shapes = []
            const child = data.getElementsByTagName('LinkList')[0]
            const grandchild = child.getElementsByTagName('Link')
            for (let i = 0; i < grandchild.length; i++) {
                const other = doc.objects[grandchild.item(i).getAttribute('value')]
                obj.shapes.push(other)
                other.parents.push({ property: name, object: obj })
            }
        } else if (name == 'Filter') {
            obj.filter = []
            const child = data.getElementsByTagName('LinkList')[0]
            const grandchild = child.getElementsByTagName('Link')
            for (let i = 0; i < grandchild.length; i++) {
                const other = doc.objects[grandchild.item(i).getAttribute('value')]
                obj.filter.push(other)
                other.parents.push({ property: name, object: obj })
            }
        } else if (name == 'OriginFeatures') {
            obj.origin_features = []
            const child = data.getElementsByTagName('LinkList')[0]
            const grandchild = child.getElementsByTagName('Link')
            for (let i = 0; i < grandchild.length; i++) {
                const other = doc.objects[grandchild.item(i).getAttribute('value')]
                obj.origin_features.push(other)
                other.parents.push({ property: name, object: obj })
            }
        }
    } catch (e) {
        console.log(name, type, data)
    }
}