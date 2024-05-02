import * as React from 'react'

import { ProductRead } from 'productboard-common'

type ProductContextProps = {
    contextProduct: ProductRead
    setContextProduct: (product: ProductRead) => void
}

export const ProductContext = React.createContext<ProductContextProps>(undefined)