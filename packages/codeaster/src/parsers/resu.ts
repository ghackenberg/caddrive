enum Mode {
    DEPL, FORC_NODA, REAC_NODA
}

interface NodeData {
    name: string
    x: number
    y: number
    z: number
    dx: number
    dy: number
    dz: number
}

interface SectionData {
    number: number,
    nodes: {
        [nodeName: string]: NodeData
    }
}

export function parseResu(data: string) {

    const depl: SectionData = { number: 0, nodes: {} }
    const forc: {[groupName: string]: SectionData} = {}
    const reac: {[groupName: string]: SectionData} = {}
    
    let iterator = 0

    while (iterator != -1 && iterator < data.length) {

        const next = data.indexOf('\n', iterator)
        const line = next != -1 ? data.substring(iterator, next) : data.substring(iterator)
        const tokens = line.trim().split(/\s+/)

        let nodes = false
        let mode: Mode = undefined
        let groupName: string = undefined
        let number: number = undefined

        if (tokens[0] == 'GROUP_NO') {
            if (tokens.length == 3 && tokens[1] == ':') {
                const name = tokens[2]
                forc[name] = { number: 0, nodes: {} }
                reac[name] = { number: 0, nodes: {} }
                groupName = name
            } else {
                console.error('Error!')
            }
        } else if (tokens[0] == 'CHAMP') {
            if (tokens.length == 6) {
                if (tokens[5] == 'DEPL') {
                    mode = Mode.DEPL
                } else if (tokens[5] == 'FORC_NODA') {
                    mode = Mode.FORC_NODA
                } else if (tokens[5] == 'REAC_NODA') {
                    mode = Mode.REAC_NODA
                } else {
                    console.error('Error!')
                }
            } else {
                console.error('Error!')
            }
        } else if (tokens[0] == 'NUMERO') {
            if (tokens.length == 5) {
                number = parseFloat(tokens[4])
                if (mode == Mode.DEPL) {
                    depl.number = number
                } else if (mode == Mode.FORC_NODA) {
                    forc[groupName].number = number
                } else if (mode == Mode.REAC_NODA) {
                    reac[groupName].number = number
                } else {
                    console.error('Error!')
                }
            } else {
                console.error('Error!')
            }
        } else if (tokens[0] == 'NOEUD') {
            if (tokens.length == 7) {
                nodes = true
            } else {
                console.error('Error!')
            }
        } else if (nodes) {
            if (tokens.length == 7) {
                const name = tokens[0]
                const x = parseFloat(tokens[1])
                const y = parseFloat(tokens[2])
                const z = parseFloat(tokens[3])
                const dx = parseFloat(tokens[4])
                const dy = parseFloat(tokens[5])
                const dz = parseFloat(tokens[6])
                if (mode == Mode.DEPL) {
                    depl.nodes[name] = { name, x, y, z, dx, dy, dz }
                } else if (mode == Mode.FORC_NODA) {
                    forc[groupName].nodes[name] = { name, x, y, z, dx, dy, dz }
                } else if (mode == Mode.REAC_NODA) {
                    reac[groupName].nodes[name] = { name, x, y, z, dx, dy, dz }
                } else {
                    console.error('Error!')
                }
            } else if (tokens.length == 0) {
                nodes = false
            } else {
                console.error('Error!')
            }
        }

        iterator = next + 1
    }

    return { depl, forc, reac }

}