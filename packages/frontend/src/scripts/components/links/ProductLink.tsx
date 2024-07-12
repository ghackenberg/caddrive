import * as React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { ProductRead } from 'productboard-common'

import { useAsyncHistory } from '../../hooks/history'
import { PRODUCTS_4 } from '../../pattern'

import ProductIcon from '/src/images/product.png'

export const ProductLink = (props: {product?: ProductRead}) => {

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
        props.product ? (
            <span>
                <NavLink to={`/products/${props.product.productId}/versions`} onClick={handleClick}>
                    <img src={ProductIcon} className='icon small'/>
                    <span>{props.product.name}</span>
                </NavLink>
            </span>
        ) : (
            <span>
                <NavLink to={`/products/new/settings`} replace={true}>
                    <img src={ProductIcon} className='icon small'/>
                    <span>New product</span>
                </NavLink>
            </span>
        )
    )
}