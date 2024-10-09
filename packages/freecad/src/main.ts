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

    public shape_file: string

    constructor(public name: string, public type: string) {}

    hasShapeBRep() {
        if (this.shape_file) {
            return this.visibility === undefined || this.visibility
        } else {
            for (const child of this.group || []) {
                if (child.hasShapeBRep()) {
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
    const diffuse: {[name: string]: MeshStandardMaterial[]} = {}
    const breps: {[name: string]: Entry} = {}
    let doc: FreeCADDocument
    const reader = new ZipReader(data)
    const parser = new DOMParser()
    // Read files in ZIP archive
    const entries = await reader.getEntries()
    for (const entry of entries) {
        //console.log(entry.filename)
        // Check file type
        if (entry.filename == 'Document.xml') {
            // Parse XML file
            const writer = new TextWriter()
            const content = await entry.getData(writer)
            const document = parser.parseFromString(content, 'application/xml')
            doc = parseFCStdDocument(document)
        } else if (entry.filename.startsWith('DiffuseColor')) {
            const writer = new Uint8ArrayWriter()
            const content = await entry.getData(writer)
            diffuse[entry.filename] = []
            for (let i = 1; i < content.length / 4; i++) {
                const a = 1 - content[i * 4 + 0] / 255
                const b = 1 - content[i * 4 + 1] / 255
                const g = 1 - content[i * 4 + 2] / 255
                const r = 1 - content[i * 4 + 3] / 255
                const color = new Color(r, g, b)
                const material = new MeshStandardMaterial({ color, opacity: a })
                diffuse[entry.filename].push(material)
            }
        } else if (entry.filename.endsWith('.brp')) {
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
    // Log result
    console.log(doc)
    // Convert to THREEJS
    const model = new Group()
    model.name = doc.label
    model.rotateX(-Math.PI / 2)
    for (const obj of Object.values(doc.objects)) {
        if (obj.hasShapeBRep()) {
            model.add(await convertFCObject(obj, diffuse, breps, brep2Glb))
        }
    }
    return model
}

async function convertFCObject(obj: FreeCADObject, diffuse: {[name: string]: MeshStandardMaterial[]}, breps: {[name: string]: Entry}, brep2Glb: (content: string) => Promise<Uint8Array>) {
    const container = new Group()
    container.name = obj.label

    if (obj.shape_file) {
        try {
            // Parse BRep file
            const entry = breps[obj.shape_file]
            const writer = new TextWriter()
            const content = await entry.getData(writer)
            console.log('Parsing', entry.filename)
            const glbFileData = await brep2Glb(content)
            const gltf = await new Promise<GLTF>((resolve, reject) => {
                GLTF.parse(glbFileData.buffer, undefined, resolve, reject)
            })
            const clone = gltf.scene.clone(true)
            // Update mesh materials
            const other = entry.filename.replace('PartShape', 'DiffuseColor').replace('.brp', '')
            if (other in diffuse) {
                const material = diffuse[other][0]
                traverse(gltf.scene, material)
            }
            traverse(clone, new MeshStandardMaterial({ color: 'black', wireframe: true }))
            // Add scene objects
            container.add(clone)
            container.add(gltf.scene)
        } catch (e) {
            console.log(e)
        }
    } else if (obj.group) {
        for (const child of obj.group) {
            if (child.hasShapeBRep()) {
                container.add(await convertFCObject(child, diffuse, breps, brep2Glb))
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
                obj.shape_file = child.getAttribute('file')
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