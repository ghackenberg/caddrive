import { TextWriter, ZipReader } from '@zip.js/zip.js'
import { Group, Quaternion, Vector3 } from 'three'

import { BRep, convertBRep, parseBRep } from './brep'

export class FreeCADDocument {
    public label: string
    public objects: {[name: string]: FreeCADObject} = {}
}

export class FreeCADPlacement {
    constructor(public position: Vector3, public quaternion: Quaternion, public angle: number, public origin: Vector3) {

    }
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
    public placement: FreeCADPlacement
    public visible: boolean

    public shape_file: string
    public shape_brep: BRep

    constructor(public name: string, public type: string) {}

    hasShapeBRep() {
        if (this.shape_brep) {
            return true
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

export async function loadFCStdModel(path: string) {
    console.log('Not yet implemented!', path)
    return new Group()
}

export async function parseFCStdModel(data: ReadableStream) {
    const breps: {[name: string]: BRep} = {}
    let doc: FreeCADDocument
    const reader = new ZipReader(data)
    const parser = new DOMParser()
    // Read files in ZIP archive
    const entries = await reader.getEntries()
    for (const entry of entries) {
        // Check file type
        if (entry.filename == 'Document.xml') {
            // Parse XML file
            const writer = new TextWriter()
            const content = await entry.getData(writer)
            const document = parser.parseFromString(content, 'application/xml')
            doc = parseFCStdDocument(document)
        } else if (entry.filename.endsWith('.brp')) {
            // Parse BRep file
            const writer = new TextWriter()
            const content = await entry.getData(writer)
            //console.log('Parsing', entry.filename)
            breps[entry.filename] = parseBRep(content)
        }
    }
    await reader.close()
    // Connect BReps to objects
    for (const object of Object.values(doc.objects)) {
        if (object.shape_file in breps) {
            object.shape_brep = breps[object.shape_file]
        }
    }
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
    for (const obj of Object.values(doc.objects)) {
        if (obj.hasShapeBRep()) {
            model.add(convertFCObject(obj))
        }
    }
    console.log(model)
    return model
}

function convertFCObject(obj: FreeCADObject) {
    const container = new Group()
    container.name = obj.label

    if (obj.shape_brep) {
        container.add(convertBRep(obj.shape_brep))
    } else if (obj.group) {
        for (const child of obj.group) {
            if (child.hasShapeBRep()) {
                container.add(convertFCObject(child))
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
        } else if (name == 'Placement') {
            const child = data.getElementsByTagName('PropertyPlacement')[0]
            const px = Number.parseFloat(child.getAttribute('Px'))
            const py = Number.parseFloat(child.getAttribute('Py'))
            const pz = Number.parseFloat(child.getAttribute('Pz'))
            const q0 = Number.parseFloat(child.getAttribute('Q0'))
            const q1 = Number.parseFloat(child.getAttribute('Q1'))
            const q2 = Number.parseFloat(child.getAttribute('Q2'))
            const q3 = Number.parseFloat(child.getAttribute('Q3'))
            const a = Number.parseFloat(child.getAttribute('A'))
            const ox = Number.parseFloat(child.getAttribute('Ox'))
            const oy = Number.parseFloat(child.getAttribute('Oz'))
            const oz = Number.parseFloat(child.getAttribute('Oz'))
            obj.placement = new FreeCADPlacement(new Vector3(px, py, pz), new Quaternion(q0, q1, q2, q3), a, new Vector3(ox, oy, oz))
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
        } else if (name == 'Visible') {
            const child = data.getElementsByTagName('Bool')[0]
            obj.visible = (child.getAttribute('value') == 'true')
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