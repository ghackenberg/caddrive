import { Comment, Issue } from "productboard-common"

export function defineIncrement(start: number, end: number) {
    const delta = end - start
    if (delta > 1000 * 60 * 60 * 24) {
        return 1000 * 60 * 60 * 24
    }
    if (delta > 1000 * 60 * 60) {
        return 1000 * 60 * 60
    }
    if (delta > 1000 * 60 * 15) {
        return 1000 * 60 * 15
    }
    if (delta > 0) {
        return 1000 * 60
    }
    throw "delta cannot be negative!"
}

export function cropDate(date: Date, start: Date, end: Date) {
    return cropTimestamp(date.getTime(), start.getTime(), end.getTime())
}

export function cropTimestamp(timestamp: number, start: number, end: number) {
    const increment = defineIncrement(start, end)
    const count = Math.floor(timestamp / increment)
    return count * increment
}

export function calculateActual(startDate: number, endDate: number, issues: Issue[], comments: {[id: string]: Comment[]}) {
    const TIME_STEP = defineIncrement(startDate, endDate)

    // Calculate detlas
    const deltas: { time: number, delta: number }[] = []
    for (const issue of issues) {
        deltas.push({ time: cropTimestamp(issue.created, startDate, endDate), delta: 1 })
        if (issue.issueId in comments) {
            for (const comment of comments[issue.issueId]) {
                if (comment.action == 'close') {
                    deltas.push({ time: cropTimestamp(comment.created, startDate, endDate), delta: -1 })
                } else if (comment.action == 'reopen') {
                    deltas.push({ time: cropTimestamp(comment.created, startDate, endDate), delta: 1 })
                }
            }
        }
    }
    deltas.sort((a, b) => a.time - b.time)
    
    // Calculate counts
    const counts: number[] = []
    let lastCount = 0
    let lastTime = 0
    for (const delta of deltas) {
        if (lastTime == 0) {
            counts.push(delta.delta)
        } else if (lastTime < delta.time) {
            for (let i = lastTime + TIME_STEP; i < delta.time; i += TIME_STEP) {
                counts.push(lastCount)
            }
            counts.push(lastCount + delta.delta)
        } else {
            counts[counts.length - 1] += delta.delta
        }
        lastCount = lastCount + delta.delta
        lastTime = delta.time
    }

    // Calculate actual
    const actual: { time: number, actual: number }[] = []
    const start = cropTimestamp(startDate, startDate, endDate)
    const end = cropTimestamp(endDate, startDate, endDate)
    const now = cropTimestamp(Date.now(), startDate, endDate)
    const min = deltas.length > 0 ? deltas[0].time : Number.MAX_VALUE
    const max = deltas.length > 0 ? deltas[deltas.length - 1].time : Number.MAX_VALUE
    for (let i = start; i <= Math.min(now, end); i += TIME_STEP) {
        if (i < min) {
            actual.push({ time: i, actual: 0 })
        } else if (i > max) {
            actual.push({ time: i, actual: lastCount })
        } else {
            actual.push({ time: i, actual: counts[(i - min) / TIME_STEP] })
        }
    }

    return actual
}