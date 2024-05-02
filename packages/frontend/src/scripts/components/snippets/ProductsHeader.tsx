import * as React from 'react'

import { ProductsLink } from '../links/ProductsLink'

export const ProductsHeader = () => {
    return (
        <header className='view products'>
            <div className='entity'>
                <ProductsLink/>
            </div>
        </header>
    )
}