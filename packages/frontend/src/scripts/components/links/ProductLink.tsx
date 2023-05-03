import * as React from 'react'
import { NavLink } from 'react-router-dom'

import { Product } from 'productboard-common'

import ProductIcon from '/src/images/product.png'

export const ProductLink = (props: {product?: Product}) => (
    props.product ? (
        <span>
            <NavLink to={`/products/${props.product.id}`}>
                <img src={ProductIcon} className='icon small'/>
                <span>{props.product.name}</span>
            </NavLink>
        </span>
    ) : (
        <span>
            <NavLink to={`/products/new/settings`}>
                <img src={ProductIcon} className='icon small'/>
                <span>New product</span>
            </NavLink>
        </span>
    )
)