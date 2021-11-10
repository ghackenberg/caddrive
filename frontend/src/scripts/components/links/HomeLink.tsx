import * as React from 'react'
import { Link } from 'react-router-dom'
// Images
import * as ProductIcon from '../../../images/product.png'

export const HomeLink = () => {

    return (
        <span>
            <Link to="/">
                <img src={ProductIcon}/>
                ProductHub
            </Link>
        </span>
    )

}