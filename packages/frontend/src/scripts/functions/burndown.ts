import { Comment, Issue, Milestone } from "productboard-common"

export function calculateActual(milestone: Milestone, issues: Issue[], comments: {[id: string]: Comment[]}) {
    // Calculate detlas
    const deltas: { time: number, delta: number }[] = []
    for (const issue of issues) {
        deltas.push({ time: new Date(issue.time).getTime(), delta: 1 })
        if (issue.id in comments) {
            for (const comment of comments[issue.id]) {
                if (comment.action == 'close') {
                    deltas.push({ time: new Date(comment.time).getTime(), delta: -1 })
                } else if (comment.action == 'reopen') {
                    deltas.push({ time: new Date(comment.time).getTime(), delta: 1 })
                }
            }
        }
    }
    // Sort deltas
    deltas.sort((a, b) => a.time - b.time)
    // Parse start and end
    const start = new Date(milestone.start).getTime()
    const end = new Date(milestone.end).getTime()
    // Calculate actual
    const actual: { time: number, actual: number }[] = []
    var lastCount = 0
    var lastTime = 0
    for (const delta of deltas) {
        if (lastTime != 0 && lastTime < start && delta.time > start) {
            actual.push({ time: start, actual: lastCount })
        }
        if (lastTime != 0 && lastTime < end && delta.time > end) {
            actual.push({ time: end, actual: lastCount })
        }
        lastCount += delta.delta
        if (delta.time >= start && delta.time <= end) {
            if (lastTime == delta.time) {
                actual[actual.length - 1].actual = lastCount
            } else {
                actual.push({ time: delta.time, actual: lastCount })
            }
        }
        lastTime = delta.time
    }
    if (Date.now() < end && lastTime < Date.now()) {
        actual.push({ time: Date.now(), actual: lastCount })
    }
    if (Date.now() >= end && lastTime < end) {
        actual.push({ time: end, actual: lastCount })
    }

    return actual
}