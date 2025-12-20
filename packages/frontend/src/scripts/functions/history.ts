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
    await go(-1)
}

export async function replace(path: string) {
    return new Promise<void>(resolve => {
        const handler = () => {
            window.removeEventListener('popstate', handler)
            resolve()
        }
        window.addEventListener('popstate', handler)
        history.replaceState(null, null, path)
    })
}

export async function push(path: string) {
    return new Promise<void>(resolve => {
        const handler = () => {
            window.removeEventListener('popstate', handler)
            resolve()
        }
        window.addEventListener('popstate', handler)
        history.pushState(null, null, path)
    })
}