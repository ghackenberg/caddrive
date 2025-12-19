import { ProductRead } from 'productboard-common'
import { createContext } from 'react'

type ProductContextProps = {
    contextProduct: ProductRead
    setContextProduct: (product: ProductRead) => void
}

export const ProductContext = createContext<ProductContextProps>(undefined)