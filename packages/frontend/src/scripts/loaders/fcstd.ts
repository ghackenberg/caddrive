import { TextWriter, ZipReader } from '@zip.js/zip.js'
import { Group } from 'three'

import { BRep, parseBRep } from './brep'

export class FCDocument {
    public objects: {[name: string]: FCObject} = {}
    public properties: {[name: string]: FCProperty} = {}
}

export class FCObject {
    public dependencies: FCObject[] = []
    public properties: {[name: string]: FCProperty} = {}
    constructor(public name: string, public type: string) {

    }
}

export abstract class FCProperty {
    constructor(public name: string, public type: string) {

    }
}
export class FCPropertyBool extends FCProperty {
    constructor(name: string, type: string, public value: boolean) {
        super(name, type)
    }
}
export class FCPropertyString extends FCProperty {
    constructor(name: string, type: string, public value: string) {
        super(name, type)
    }
}
export class FCPropertyEnumeration extends FCProperty {
    constructor(name: string, type: string, public value: number) {
        super(name, type)
    }
}
export class FCPropertyFloat extends FCProperty {
    constructor(name: string, type: string, public value: number) {
        super(name, type)
    }
}
export class FCPropertyLength extends FCProperty {
    constructor(name: string, type: string, public value: number) {
        super(name, type)
    }
}
export class FCPropertyAngle extends FCProperty {
    constructor(name: string, type: string, public value: number) {
        super(name, type)
    }
}
export class FCPropertyUUID extends FCProperty {
    constructor(name: string, type: string, public value: string) {
        super(name, type)
    }
}
export class FCPropertyVector extends FCProperty {
    constructor(name: string, type: string, public value: { x: number, y: number, z: number }) {
        super(name, type)
    }
}
export class FCPropertyPlacement extends FCProperty {
    constructor(name: string, type: string) {
        super(name, type)
    }
}
export class FCPropertyPartShape extends FCProperty {
    constructor(name: string, type: string) {
        super(name, type)
    }
}
export class FCPropertyLink extends FCProperty {
    constructor(name: string, type: string) {
        super(name, type)
    }
}
export class FCPropertyLinkList extends FCProperty {
    constructor(name: string, type: string) {
        super(name, type)
    }
}
export class FCPropertyLinkSub extends FCProperty {
    constructor(name: string, type: string) {
        super(name, type)
    }
}
export class FCPropertyLinkSubList extends FCProperty {
    constructor(name: string, type: string) {
        super(name, type)
    }
}
export class FCPropertyMap extends FCProperty {
    constructor(name: string, type: string) {
        super(name, type)
    }
}
export class FCPropertyExpressionEngine extends FCProperty {
    constructor(name: string, type: string) {
        super(name, type)
    }
}
export class FCPropertyConstraintList extends FCProperty {
    constructor(name: string, type: string) {
        super(name, type)
    }
}
export class FCPropertyGeometryList extends FCProperty {
    constructor(name: string, type: string) {
        super(name, type)
    }
}

export async function loadFCStdModel(path: string) {
    console.log('Not yet implemented!', path)
    return new Group()
}

export async function parseFCStdModel(data: ReadableStream) {
    const reader = new ZipReader(data)
    const parser = new DOMParser()
    const entries = await reader.getEntries()
    const breps: {[name: string]: BRep} = {}
    let doc: FCDocument
    for (const entry of entries) {
        if (entry.filename == 'Document.xml') {
            const writer = new TextWriter()
            const content = await entry.getData(writer)
            const document = parser.parseFromString(content, 'application/xml')
            doc = parseFCStdDocument(document)
        } else if (entry.filename.endsWith('.brp')) {
            const writer = new TextWriter()
            const content = await entry.getData(writer)
            breps[entry.filename] = parseBRep(content)
        }
    }
    await reader.close()
    console.log(doc)
    console.log(breps)
    return new Group()
}

function parseFCStdDocument(data: Document) {
    const doc = new FCDocument()
    
    parseFCStdDocumentProperties(data, doc)
    parseFCStdDocumentObjects(data, doc)
    parseFCStdDocumentObjectData(data, doc)

    return doc
}

function parseFCStdDocumentProperties(data: Document, doc: FCDocument) {
    const properties = data.getElementsByTagName('Properties')[0]

    // Parse properties
    const property_list = properties.getElementsByTagName('Property')

    for (let i = 0; i < property_list.length; i++) {
        const property = property_list.item(i)
        const property_name = property.getAttribute('name')

        doc.properties[property_name] = parseFCStdProperty(property)
    }
}

function parseFCStdDocumentObjects(data: Document, doc: FCDocument) {
    const objects = data.getElementsByTagName('Objects')[0]

    // Parse objects
    const object_list = objects.getElementsByTagName('Object')

    for (let i = 0; i < object_list.length; i++) {
        const object = object_list.item(i)
        const object_name = object.getAttribute('name')
        const object_type = object.getAttribute('type')

        doc.objects[object_name] = new FCObject(object_name, object_type)
    }

    // Parse object dependencies
    const objectdeps_list = objects.getElementsByTagName('ObjectDeps')

    for (let i = 0; i < objectdeps_list.length; i++) {
        const objectdeps = objectdeps_list.item(i)
        const objectdeps_name = objectdeps.getAttribute('Name')

        const dep_list = objectdeps.getElementsByTagName('Dep')

        for (let j = 0; j < dep_list.length; j++) {
            const dep = dep_list.item(j)
            const dep_name = dep.getAttribute('Name')

            doc.objects[objectdeps_name].dependencies.push(doc.objects[dep_name])
        }
    }
}

function parseFCStdDocumentObjectData(data: Document, doc: FCDocument) {
    const objectdata = data.getElementsByTagName('ObjectData')[0]
    const object_list = objectdata.getElementsByTagName('Object')

    for (let i = 0; i < object_list.length; i++) {
        const object = object_list.item(i)
        const object_name = object.getAttribute('name')

        const properties = object.getElementsByTagName('Properties')[0]
        const property_list = properties.getElementsByTagName('Property')

        for (let j = 0; j < property_list.length; j++) {
            const property = property_list.item(j)
            const property_name = property.getAttribute('name')

            doc.objects[object_name].properties[property_name] = parseFCStdProperty(property)
        }
    }
}

function parseFCStdProperty(data: Element): FCProperty {
    const name = data.getAttribute('name')
    const type = data.getAttribute('type')

    if (type == 'App::PropertyString') {
        const child = data.getElementsByTagName('String')[0]
        const value = child.getAttribute('value')
        return new FCPropertyString(name, type, value)
    } else if (type == 'App::PropertyEnumeration') {
        const child = data.getElementsByTagName('Integer')[0]
        const value = Number.parseInt(child.getAttribute('value'))
        return new FCPropertyEnumeration(name, type, value)
    } else if (type == 'App::PropertyFloat') {
        const child = data.getElementsByTagName('Float')[0]
        const value = Number.parseFloat(child.getAttribute('value'))
        return new FCPropertyFloat(name, type, value)
    } else if (type == 'App::PropertyLength') {
        const child = data.getElementsByTagName('Float')[0]
        const value = Number.parseFloat(child.getAttribute('value'))
        return new FCPropertyLength(name, type, value)
    } else if (type == 'App::PropertyAngle') {
        const child = data.getElementsByTagName('Float')[0]
        const value = Number.parseFloat(child.getAttribute('value'))
        return new FCPropertyAngle(name, type, value)
    } else if (type == 'App::PropertyBool') {
        const child = data.getElementsByTagName('Bool')[0]
        const value = child.getAttribute('value') == 'true'
        return new FCPropertyBool(name, type, value)
    } else if (type == 'App::PropertyUUID') {
        const child = data.getElementsByTagName('Uuid')[0]
        const value = child.getAttribute('value')
        return new FCPropertyUUID(name, type, value)
    } else if (type == 'App::PropertyVector') {
        const child = data.getElementsByTagName('PropertyVector')[0]
        const x = Number.parseFloat(child.getAttribute('valueX'))
        const y = Number.parseFloat(child.getAttribute('valueY'))
        const z = Number.parseFloat(child.getAttribute('valueZ'))
        return new FCPropertyVector(name, type, { x, y, z })
    } else if (type == 'App::PropertyPlacement') {
        console.log(data)
        // TODO Parse property link
        return new FCPropertyPlacement(name, type)
    } else if (type == 'Part::PropertyPartShape') {
        console.log(data)
        // TODO Parse property link
        return new FCPropertyPartShape(name, type)
    } else if (type == 'App::PropertyLink') {
        console.log(data)
        // TODO Parse property link
        return new FCPropertyLink(name, type)
    } else if (type == 'App::PropertyLinkList') {
        console.log(data)
        // TODO Parse property link
        return new FCPropertyLinkList(name, type)
    } else if (type == 'App::PropertyLinkSub') {
        console.log(data)
        // TODO Parse property link
        return new FCPropertyLinkSub(name, type)
    } else if (type == 'App::PropertyLinkSubList') {
        console.log(data)
        // TODO Parse property link
        return new FCPropertyLinkSubList(name, type)
    } else if (type == 'App::PropertyMap') {
        console.log(data)
        // TODO Parse property maps
        return new FCPropertyMap(name, type)
    } else if (type == 'App::PropertyExpressionEngine') {
        console.log(data)
        // TODO Parse property expression engine
        return new FCPropertyExpressionEngine(name, type)
    } else if (type == 'Sketcher::PropertyConstraintList') {
        console.log(data)
        // TODO Parse property expression engine
        return new FCPropertyConstraintList(name, type)
    } else if (type == 'Part::PropertyGeometryList') {
        console.log(data)
        // TODO Parse property expression engine
        return new FCPropertyGeometryList(name, type)
    } else {
        console.log(data)
        throw 'Property type not supported: ' + type
    }
}