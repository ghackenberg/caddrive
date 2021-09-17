import { Product } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

export const ProductLink = (props: {product?: Product}) => {

    return (
        <Fragment>
            <span>
                <Link to="/">Welcome Page</Link>
            </span>
            <span>
                <Link to='/products'>Products</Link>
            </span>
            { props.product ? (
            <span>
                <Link to={`/products/${props.product.id}`}>{'Product ' + props.product.name}</Link>
            </span>
            ) : (
            <span>
                <Link to={`/products/new`}>new Product</Link>
            </span>
            )}
        </Fragment>  
    )
}