import * as React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { Product } from 'productboard-common'

import { useAsyncHistory } from '../../hooks/history'
import { PRODUCTS_4 } from '../../pattern'

import ProductIcon from '/src/images/product.png'

export const ProductLink = (props: {product?: Product}) => {

    const { pathname } = useLocation()
    const { replace, goBack } = useAsyncHistory()

    async function handleClick(event: React.UIEvent) {
        event.preventDefault()
        if (PRODUCTS_4.test(pathname)) {
            await goBack()
        }
        await replace(`/products/${props.product.id}/versions`)
    }

    return (
        props.product ? (
            <span>
                <NavLink to={`/products/${props.product.id}/versions`} onClick={handleClick}>
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