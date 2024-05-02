import { useHistory } from "react-router"

export function useAsyncHistory() {
    const history = useHistory()

    async function go(total: number) {
        return new Promise<void>(resolve => {
            const unregister = history.listen(() => {
                unregister()
                resolve()
            })
            history.go(total)
        })
    }

    async function goBack() {
        return new Promise<void>(resolve => {
            const unregister = history.listen(() => {
                unregister()
                resolve()
            })
            history.goBack()
        })
    }

    async function replace(path: string) {
        return new Promise<void>(resolve => {
            const unregister = history.listen(() => {
                unregister()
                resolve()
            })
            history.replace(path)
        })
    }

    async function push(path: string) {
        return new Promise<void>(resolve => {
            const unregister = history.listen(() => {
                unregister()
                resolve()
            })
            history.push(path)
        })
    }

    return { go, goBack, replace, push }
}