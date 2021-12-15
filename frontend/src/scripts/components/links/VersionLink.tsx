import * as React from 'react'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
// Commons
import { Product, Version } from 'productboard-common'
// Links
import { VersionsLink } from './VersionsLink'

export const VersionLink = (props: {product: Product, version?: Version}) => {
    return (
        <Fragment>
            <VersionsLink product={props.product}/>
            { props.version ? (
                <span>
                    <NavLink to={`/products/${props.product.id}/versions/${props.version.id}`}>{props.version.major}.{props.version.minor}.{props.version.patch}</NavLink>
                </span>
            ) : (
                <span>
                    <NavLink to={`/products/${props.product.id}/versions/new`}>New version</NavLink>
                </span>
            )}
        </Fragment>  
    )
}