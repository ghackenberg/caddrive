import * as React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { ProductRead } from 'productboard-common'

import { useAsyncHistory } from '../../hooks/history'
import { PRODUCTS_4 } from '../../pattern'

import IssueIcon from '/src/images/issue.png'

export const IssuesLink = (props: {product: ProductRead}) => {

    // HISTORY

    const { go, replace } = useAsyncHistory()

    // LOCATION
    
    const { pathname, hash } = useLocation()

    // FUNCTIONS

    async function handleClick(event: React.UIEvent) {
        event.preventDefault()
        const products4 = PRODUCTS_4.exec(pathname)
        if (products4) {
            await go(hash ? -2 : -1)
        } else {
            hash && await go(-1)
        }
        await replace(`/products/${props.product.productId}/issues`)
    }

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.productId}/issues`} onClick={handleClick}>
                <img src={IssueIcon} className='icon small'/>
                <span className='label'>Issues</span>
                <span className='badge'>{props.product.openIssueCount}</span>
            </NavLink>
        </span>
    )

}