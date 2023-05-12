import * as React from 'react'

import { useProducts } from '../../hooks/list'

export const ProductCount = (props: { public?: 'true' | 'false' }) => {
    const products = useProducts(props.public)
    return (
        <>
            {products ? products.length : '?'}
        </>
    )
}