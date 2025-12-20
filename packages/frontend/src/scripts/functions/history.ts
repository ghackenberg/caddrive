
export async function go(total: number) {
    return new Promise<void>(resolve => {
        const handler = () => {
            window.removeEventListener('popstate', handler)
            resolve()
        }
        window.addEventListener('popstate', handler)
        history.go(total)
    })
}

export async function back() {
    return new Promise<void>(resolve => {
        const handler = () => {
            window.removeEventListener('popstate', handler)
            resolve()
        }
        window.addEventListener('popstate', handler)
        history.back()
    })
}

export async function replaceState(path: string) {
    history.replaceState(null, null, path)
}

export async function pushState(path: string) {
    return new Promise<void>(resolve => {
        const handler = () => {
            window.removeEventListener('popstate', handler)
            resolve()
        }
        window.addEventListener('popstate', handler)
        history.pushState(null, null, path)
    })
}