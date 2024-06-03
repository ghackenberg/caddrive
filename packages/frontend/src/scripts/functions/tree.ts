import { VersionRead } from "productboard-common"

export function computeColor(versions: VersionRead[]) {

    const result: { [versionId: string]: number } = {}

    let hue = 240

    for (const curVers of (versions || []).map(i => i).reverse()) {
        if (!(curVers.versionId in result)) {
            result[curVers.versionId] = hue
            hue += 140
        }
        (curVers.baseVersionIds || []).forEach((prevVersId, prevVersIdx) => {
            if (!(prevVersId in result)) {
                result[prevVersId] = result[curVers.versionId] + prevVersIdx * 40
            }
        })
    }

    return result

}

export function computeTree(versions: VersionRead[]) {

    // Initialize result

    const result: { versionId: string, before: string[], afterFirst: string[], afterRest: string[] }[] = []

    // Initialize iterator

    let iterator: string[] = []

    // Process versions

    for(const version of (versions || []).map(i => i).reverse()) {

        // Calculate before

        const before = iterator.filter(i => i != version.versionId)
        before.unshift(version.versionId)

        // Calculate after

        const afterFirst = (version.baseVersionIds || []).map(i => i)
        const afterRest = iterator.filter(i => i != version.versionId)

        // Remember tree node

        result.push({ versionId: version.versionId, before, afterFirst, afterRest })

        // Update iterator

        iterator = iterator.filter(i => i != version.versionId)
        for (const baseVersionId of version.baseVersionIds || []) {
            if (!iterator.includes(baseVersionId)) {
                iterator.push(baseVersionId)
            }
        }

    }

    // Return result

    return result

}