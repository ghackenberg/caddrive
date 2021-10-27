import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { Product, Version } from 'fhooe-audit-platform-common'
// Links
import { ProductLink } from './ProductLink'

export const VersionLink = (props: {product: Product, version?: Version}) => {
    return (
        <Fragment>
            <ProductLink product={props.product}/>
            { props.version ? (
            <span>
                <Link to={`/audits?version=${props.version.id}`}>{props.version.name}</Link>
            </span>
            ) : (
            <span>
                <Link to={`/versions/new?product=${props.product.id}`}>New version</Link>
            </span>
            )}
        </Fragment>  
    )
}