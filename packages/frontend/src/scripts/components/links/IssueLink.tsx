import * as React from 'react'
import { Fragment } from 'react'
import { NavLink } from 'react-router-dom'

import { Issue, Product } from 'productboard-common'

import { IssuesLink } from './IssuesLink'

export const IssueLink = (props: { product: Product, issue?: Issue }) => (
    <Fragment>
        <IssuesLink product={props.product}/>
        { props.issue ? (
            <span>
                <NavLink to={`/products/${props.product.id}/issues/${props.issue.id}`}>
                    {props.issue.label}
                </NavLink>
            </span>
        ) : (
            <span>
                <NavLink to={`/products/${props.product.id}/issues/new`}>
                    New issue
                </NavLink>
            </span>
        )}
    </Fragment>  
)