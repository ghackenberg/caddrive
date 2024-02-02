import { Face, Hexa, MailGroup, Node, NodeGroup, Quad } from "../main"

enum Mode {
    NONE, COOR_3D, HEXA8, GROUP_MA, GROUP_NO, QUAD4, FIN
}

export function parseMail(data: string) {

    // Return data structures

    const nodes: {[name: string]: Node} = {}
    const hexas: {[name: string]: Hexa} = {}
    const faces: {[name: string]: Face} = {}
    const hexasAndFaces: {[name: string]: Hexa | Face} = {}
    const quads: {[name: string]: Quad} = {}
    const nodeGroups: {[name: string]: NodeGroup} = {}
    const mailGroups: {[name: string]: MailGroup} = {}

    // Internal data structures

    let iterator = 0
    let mode = Mode.NONE
    let mailGroup: MailGroup = null
    let nodeGroup: NodeGroup = null
    let quad: Quad = null

    // Processing loop

    while (iterator != -1 && iterator < data.length) {

        // Extract tokens

        const next = data.indexOf('\n', iterator)
        const line = next != -1 ? data.substring(iterator, next) : data.substring(iterator)
        const comment = line.indexOf('%%')
        const content = comment != -1 ? line.substring(0, comment) : line
        const tokens = content.trim().split(/\s+/)

        // Process tokens

        if (tokens.length == 0) {
            // ignore empty lines
        } else if (mode == Mode.FIN) {
            console.error('Error!')
        } else if (tokens[0] == 'COOR_3D') {
            if (mode == Mode.NONE && tokens.length == 1) {
                mode = Mode.COOR_3D
            } else {
                console.error('Error!')
            }
        } else if (tokens[0] == 'HEXA8') {
            if (mode == Mode.NONE && tokens.length == 1) {
                mode = Mode.HEXA8
            } else {
                console.error('Error!')
            }
        } else if (tokens[0] == 'GROUP_MA') {
            if (mode == Mode.NONE && tokens.length == 4 && tokens[1] == 'NOM' && tokens[2] == '=') {
                mode = Mode.GROUP_MA
                const name = tokens[3]
                mailGroup = new MailGroup(name, [])
                mailGroups[name] = mailGroup
            } else {
                console.error('Error!')
            }
        } else if (tokens[0] == 'GROUP_NO') {
            if (mode == Mode.NONE && tokens.length == 4 && tokens[1] == 'NOM' && tokens[2] == '=') {
                mode = Mode.GROUP_NO
                const name = tokens[3]
                nodeGroup = new NodeGroup(name, [])
                nodeGroups[name] = nodeGroup
            } else {
                console.error('Error!')
            }
        } else if (tokens[0] == 'QUAD4') {
            if (mode == Mode.NONE && tokens.length == 4 && tokens[1] == 'NOM' && tokens[2] == '=') {
                mode = Mode.QUAD4
                const name = tokens[3]
                quad = new Quad(name, [])
                quads[name] = quad
            } else {
                console.error('Error!')
            }
        } else if (tokens[0] == 'FINSF') {
            if (mode != Mode.NONE && tokens.length == 1) {
                mode = Mode.NONE
                mailGroup = null
                nodeGroup = null
            } else {
                console.error('Error!')
            }
        } else if (tokens[0] == 'FIN') {
            if (mode != Mode.NONE && tokens.length == 1) {
                mode = Mode.FIN
            } else {
                console.error('Error!')
            }
        } else if (mode == Mode.COOR_3D) {
            // Parse node
            if (tokens.length == 4) {
                const name = tokens[0]
                const x = parseFloat(tokens[1])
                const y = parseFloat(tokens[2])
                const z = parseFloat(tokens[3])
                nodes[name] = new Node(name, x, y, z)
            } else {
                console.error('Error!')
            }
        } else if (mode == Mode.HEXA8) {
            if (tokens.length == 9) {
                const name = tokens[0]
                const n0 = nodes[tokens[1]]
                const n1 = nodes[tokens[2]]
                const n2 = nodes[tokens[3]]
                const n3 = nodes[tokens[4]]
                const n4 = nodes[tokens[5]]
                const n5 = nodes[tokens[6]]
                const n6 = nodes[tokens[7]]
                const n7 = nodes[tokens[8]]
                const hexa = new Hexa(name, [n0, n1, n2, n3, n4, n5, n6, n7])
                hexas[name] = hexa
                hexasAndFaces[name] = hexa
            } else {
                console.error('Error!')
            }
        } else if (mode == Mode.GROUP_MA) {
            for (const token in tokens) {
                mailGroup.objects.push(hexasAndFaces[token])
            }
        } else if (mode == Mode.GROUP_NO) {
            for (const token in tokens) {
                nodeGroup.objects.push(nodes[token])
            }
        } else if (mode == Mode.QUAD4) {
            if (tokens.length == 4) {
                const name = tokens[0]
                const n0 = nodes[tokens[1]]
                const n1 = nodes[tokens[2]]
                const n2 = nodes[tokens[3]]
                const n3 = nodes[tokens[4]]
                const face = new Face(name, [n0, n1, n2, n3])
                quad.faces.push(face)
                faces[name] = face
                hexasAndFaces[name] = face
            } else {
                console.error('Error!')
            }
        } else {
            console.error('Error!')
        }

        // Update iterator

        iterator = next

    }

    // Return statement

    return { nodes, hexas, faces, hexasAndFaces, quads, nodeGroups, mailGroups }

}