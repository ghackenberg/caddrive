export function formatMonth(date: Date) {
    return date.toISOString().substring(0,7)
}

export function formatDate(date: Date) {
    return date.toISOString().substring(0,10)
}

export function formatDateHour(date: Date) {
    return `${formatDate(date)} @ ${date.toLocaleTimeString().substring(0,5)}`
}

export function formatDateHourMinute(date: Date) {
    return `${formatDate(date)} @ ${date.toLocaleTimeString().substring(0,5)}`
}