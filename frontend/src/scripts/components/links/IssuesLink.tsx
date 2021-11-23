import * as React from 'react'
import { NavLink } from 'react-router-dom'
// Commons
import { Product } from 'fhooe-audit-platform-common'
// Images
import * as IssueIcon from '/src/images/issue.png'

export const IssuesLink = (props: {product: Product}) => {
    return (
        <span>
            <NavLink to={`/products/${props.product.id}/issues`}>
                <img src={IssueIcon}/>
                Issues
            </NavLink>
        </span>
    )
}