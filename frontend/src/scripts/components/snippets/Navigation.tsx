import * as React from 'react'
import { Link } from 'react-router-dom'
// Images
import * as UserIcon from '/src/images/user.png'
import * as ProductIcon from '/src/images/product.png'

export const Navigation = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/users"><img src={UserIcon}/>Users</Link></li>
                <li><Link to="/products"><img src={ProductIcon}/>Products</Link></li>
            </ul>
        </nav>
    )
}