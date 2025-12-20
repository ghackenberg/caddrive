import { useLocation } from "react-router"
import { go, replaceState } from '../functions/history.js'
import { PRODUCTS_4, PRODUCTS_6 } from "../pattern.js"

export function useNavigationStack() {

    const { pathname, hash } = useLocation()

    async function navigate(event: React.MouseEvent<HTMLAnchorElement>) {
        event.preventDefault()
        const nextpath = event.currentTarget.pathname
        const products6 = PRODUCTS_6.exec(pathname)
        if (products6) {
            if (products6[5] != 'new' && products6[6] == 'settings') {
                await go(hash ? -4 : -3)
            } else {
                await go(hash ? -3 : -2)
            }
        } else if (PRODUCTS_4.test(pathname)) {
            await go(hash ? -2 : -1)
        } else {
            hash && await go(-1)
        }
        await replaceState(nextpath)
    }

    return { navigate }
}