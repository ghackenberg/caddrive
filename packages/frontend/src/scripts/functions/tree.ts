import { Version } from "productboard-common"

export function computeTree(versions: Version[]) {

    // Calculate children
    const children: {[versionId: string]: Version[]} = {}

    for (const version of versions || []) {
        children[version.versionId] = []
        for (const baseVersionId of version.baseVersionIds) {
            children[baseVersionId].push(version)
        }
    }

    // Calculate siblings

    const siblings: {[versionId: string]: Version[]} = {}

    for (const version of versions || []) {
        siblings[version.versionId] = []
    }

    for (let outerIndex = versions? versions.length - 1 : -1 ; outerIndex >= 0; outerIndex--) {
        const outerVersion = versions[outerIndex]
        const baseVersionIds = [...outerVersion.baseVersionIds]
        for (let innerIndex = outerIndex - 1; innerIndex >= 0; innerIndex--) {
            const innerVersion = versions[innerIndex]
            const baseIndex = baseVersionIds.indexOf(innerVersion.versionId)
            if (baseIndex != -1) {
                baseVersionIds.splice(baseIndex, 1)
            }
            if (baseVersionIds.length > 0) {
                siblings[innerVersion.versionId].push(outerVersion)
            }
        }
    }

    // Calculate indents
    const indents: {[versionId: string]: number} = {}

    let next = 0

    for (const version of versions || []) {
        if (!(version.versionId in indents)) {
            const indent = version.baseVersionIds.length > 0 ? indents[version.baseVersionIds[0]] : next
        
            indents[version.versionId] = indent
        }

        for (let index = 0; index < children[version.versionId].length; index++) {
            const child = children[version.versionId][index]
            if (!(child.versionId in indents)) {
                if (index == 0) {
                    indents[child.versionId] = indents[version.versionId]
                } else {
                    indents[child.versionId] = ++next
                }
            }
        }
    }

    // Calculate min/max
    const childrenMin: {[versionId: string]: number} = {}
    const childrenMax: {[versionId: string]: number} = {}

    for (const version of versions || []) {
        let min = indents[version.versionId]
        let max = 0

        for (const child of children[version.versionId]) {
            min = Math.min(min, indents[child.versionId])
            max = Math.max(max, indents[child.versionId])
        }

        childrenMin[version.versionId] = min
        childrenMax[version.versionId] = max
    }

    return { children, siblings, indents, indent: next+1, childrenMin, childrenMax }
    
}
