import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { Issue, Product } from 'fhooe-audit-platform-common'
// Links
import { IssuesLink } from './IssuesLink'

export const IssueLink = (props: { product: Product, issue?: Issue }) => {
    return (
        <Fragment>
            <IssuesLink product={props.product}/>
            { props.issue ? (
                <span>
                    <Link to={`/products/${props.product.id}/issues/${props.issue.id}`}>{props.issue.label}</Link>
                </span>
            ) : (
                <span>
                    <Link to={`/products/${props.product.id}/issues/new`}>New issue</Link>
                </span>
            )}
        </Fragment>  
    )
}