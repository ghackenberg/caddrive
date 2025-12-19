export function useAsyncHistory() {
    async function go(total: number) {
        return new Promise<void>(resolve => {
            const handler = () => {
                window.removeEventListener('popstate', handler)
                resolve()
            }
            window.addEventListener('popstate', handler)
            history.go(total)
        })
    }

    async function goBack() {
        return new Promise<void>(resolve => {
            const handler = () => {
                window.removeEventListener('popstate', handler)
                resolve()
            }
            window.addEventListener('popstate', handler)
            history.back()
        })
    }

    async function replace(path: string) {
        return new Promise<void>(resolve => {
            const handler = () => {
                window.removeEventListener('popstate', handler)
                resolve()
            }
            window.addEventListener('popstate', handler)
            history.replaceState(null, null, path)
        })
    }

    async function push(path: string) {
        return new Promise<void>(resolve => {
            const handler = () => {
                window.removeEventListener('popstate', handler)
                resolve()
            }
            window.addEventListener('popstate', handler)
            history.pushState(null, null, path)
        })
    }

    return { go, goBack, replace, push }
}