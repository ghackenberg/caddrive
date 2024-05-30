function format(value: number) {
    if (value < 10) {
        return `0${value}`
    } else {
        return `${value}`
    }
}

export function formatYear(date: Date) {
    return `${date.getFullYear()}`
}

export function formatMonth(date: Date) {
    return `${formatYear(date)}-${format(date.getMonth() + 1)}`
}

export function formatDate(date: Date) {
    return `${formatMonth(date)}-${format(date.getDate())}`
}

export function formatTime(date: Date) {
    return `${format(date.getHours())}:${format(date.getMinutes())}`
}

export function formatDateHourMinute(date: Date) {
    return `${formatDate(date)} @ ${formatTime(date)}`
}