import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { Product, Version } from 'fhooe-audit-platform-common'
// Links
import { VersionsLink } from './VersionsLink'

export const VersionLink = (props: {product: Product, version?: Version}) => {
    return (
        <Fragment>
            <VersionsLink product={props.product}/>
            { props.version ? (
                <span>
                    <Link to={`/products/${props.product.id}/versions/${props.version.id}`}>{props.version.major}.{props.version.minor}.{props.version.patch}</Link>
                </span>
            ) : (
                <span>
                    <Link to={`/products/${props.product.id}/versions/new`}>New version</Link>
                </span>
            )}
        </Fragment>  
    )
}