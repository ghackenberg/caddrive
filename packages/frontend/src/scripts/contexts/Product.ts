import * as React from 'react'

import { Product } from 'productboard-common'

type ProductContextProps = {
    contextProduct: Product
    setContextProduct: (product: Product) => void
}

export const ProductContext = React.createContext<ProductContextProps>(undefined)