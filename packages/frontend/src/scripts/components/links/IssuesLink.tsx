import * as React from 'react'
import { NavLink } from 'react-router-dom'

import { ProductRead } from 'productboard-common'

import { useNavigationStack } from '../../hooks/navigation'

import IssueIcon from '/src/images/issue.png'

export const IssuesLink = (props: {product: ProductRead}) => {

    // NAVIGATION

    const { navigate } = useNavigationStack()

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.productId}/issues`} onClick={navigate}>
                <img src={IssueIcon} className='icon small'/>
                <span className='label'>Issues</span>
                <span className='badge'>{props.product.openIssueCount}</span>
            </NavLink>
        </span>
    )

}