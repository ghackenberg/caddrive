import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { Issue, Product } from 'fhooe-audit-platform-common'
// Links
import { ProductLink } from './ProductLink'

export const IssueLink = (props: { product: Product, issue?: Issue }) => {
    return (
        <Fragment>
            <ProductLink product={props.product}/>
            { props.issue ? (
                <span>
                    <Link to={`/comments?issue=${props.issue.id}`}>{props.issue.label}</Link>
                </span>
            ) : (
                <span>
                    <Link to={`/issues/new?prodict=${props.product.id}`}>New issue</Link>
                </span>
            )}
        </Fragment>  
    )
}