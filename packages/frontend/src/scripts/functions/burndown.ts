import { CommentRead, IssueRead } from "productboard-common"

export function calculateActual(startDate: number, endDate: number, issues: IssueRead[], comments: {[id: string]: CommentRead[]}) {

    // Calculate deltas

    const deltas: { time: number, value: number }[] = []

    for (const issue of issues) {
        deltas.push({ time: issue.created, value: 1 })
        if (issue.issueId in comments) {
            for (const comment of comments[issue.issueId]) {
                if (comment.action == 'close') {
                    deltas.push({ time: comment.created, value: -1 })
                } else if (comment.action == 'reopen') {
                    deltas.push({ time: comment.created, value: 1 })
                }
            }
        }
    }

    deltas.sort((a, b) => a.time - b.time)

    // Calculate actual

    const actual: { time: number, actual: number }[] = []

    let count = 0

    for (const delta of deltas) {

        count += delta.value

        if (delta.time >= startDate) {
            
            if (actual.length == 0 && delta.time > startDate) {
                actual.push({ time: startDate, actual: count - delta.value })
            }
            
            if (delta.time <= endDate) {
                actual.push({ time: delta.time, actual: count })
            } else {
                break
            }

        }
    }

    if (actual.length == 0) {
        actual.push({ time: startDate, actual: 0 })
    }
    if (actual[actual.length - 1].time < endDate) {
        actual.push({ time: endDate, actual: actual[actual.length - 1].actual})
    }

    return actual
}