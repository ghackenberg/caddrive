import * as React from 'react'
import { NavLink } from 'react-router-dom'

import ProductIcon from '/src/images/product.png'

export const ProductsLink = () => (
    <span>
        <NavLink to="/products" replace={true}>
            <img src={ProductIcon} className='icon small'/>
            <span>Products</span>
        </NavLink>
    </span>
)