import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
// Links
import { HomeLink } from './HomeLink'

export const ProductsLink = () => {
    return (
        <Fragment>
            <HomeLink/>
            <span>
                <Link to="/products">Products</Link>
            </span>
        </Fragment>
    )
}