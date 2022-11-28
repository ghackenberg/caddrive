import { Version } from "productboard-common"

export function computeTree(versions: Version[]) {

    // Calculate children
    const children: {[id: string]: Version[]} = {}

    for (const version of versions || []) {
        children[version.id] = []
        for (const baseVersionId of version.baseVersionIds) {
            children[baseVersionId].push(version)
        }
    }

    // Calculate siblings

    const siblings: {[id: string]: Version[]} = {}

    for (const version of versions || []) {
        siblings[version.id] = []
    }

    for (let outerIndex = versions? versions.length - 1 : -1 ; outerIndex >= 0; outerIndex--) {
        const outerVersion = versions[outerIndex]
        const baseVersionIds = [...outerVersion.baseVersionIds]
        for (let innerIndex = outerIndex - 1; innerIndex >= 0; innerIndex--) {
            const innerVersion = versions[innerIndex]
            const baseIndex = baseVersionIds.indexOf(innerVersion.id)
            if (baseIndex != -1) {
                baseVersionIds.splice(baseIndex, 1)
            }
            if (baseVersionIds.length > 0) {
                siblings[innerVersion.id].push(outerVersion)
            }
        }
    }

    // Calculate indents
    const indents: {[id: string]: number} = {}

    let next = 0

    for (const version of versions || []) {
        if (!(version.id in indents)) {
            const indent = version.baseVersionIds.length > 0 ? indents[version.baseVersionIds[0]] : next
        
            indents[version.id] = indent
        }

        for (let index = 0; index < children[version.id].length; index++) {
            const child = children[version.id][index]
            if (!(child.id in indents)) {
                if (index == 0) {
                    indents[child.id] = indents[version.id]
                } else {
                    indents[child.id] = ++next
                }
            }
        }
    }

    // Calculate min/max
    const childrenMin: {[id: string]: number} = {}
    const childrenMax: {[id: string]: number} = {}

    for (const version of versions || []) {
        let min = indents[version.id]
        let max = 0

        for (const child of children[version.id]) {
            min = Math.min(min, indents[child.id])
            max = Math.max(max, indents[child.id])
        }

        childrenMin[version.id] = min
        childrenMax[version.id] = max
    }

    return { children, siblings, indents, indent: next+1, childrenMin, childrenMax }
    
}
