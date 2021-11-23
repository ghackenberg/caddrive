import * as React from 'react'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
// Commons
import { Product } from 'fhooe-audit-platform-common'
// Links
import { ProductsLink } from './ProductsLink'

export const ProductLink = (props: {product?: Product}) => {
    return (
        <Fragment>
            <ProductsLink/>
            { props.product ? (
                <span>
                    <NavLink to={`/products/${props.product.id}`}>{props.product.name}</NavLink>
                </span>
            ) : (
                <span>
                    <NavLink to={`/products/new`}>New product</NavLink>
                </span>
            )}
        </Fragment>  
    )
}