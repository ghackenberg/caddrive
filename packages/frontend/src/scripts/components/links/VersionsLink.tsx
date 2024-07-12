import * as React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { ProductRead } from 'productboard-common'

import { useAsyncHistory } from '../../hooks/history'
import { PRODUCTS_4 } from '../../pattern'

import VersionIcon from '/src/images/version.png'

export const VersionsLink = (props: {product: ProductRead}) => {

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
        await replace(`/products/${props.product.productId}/versions`)
    }

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.productId}/versions`} onClick={handleClick}>
                <img src={VersionIcon} className='icon small'/>
                <span className='label'>Versions</span>
                <span className='badge'>{props.product.versionCount}</span>
            </NavLink>
        </span>
    )

}