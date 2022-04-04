import * as React from 'react'
import { NavLink } from 'react-router-dom'
// Images
import * as ProductIcon from '/src/images/product.png'

export const ProductsLink = () => (
    <span>
        <NavLink to="/products">
            <img src={ProductIcon}/>
            Products
        </NavLink>
    </span>
)