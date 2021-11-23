import * as React from 'react'
import { NavLink } from 'react-router-dom'
// Commons
import { Product } from 'fhooe-audit-platform-common'
// Images
import * as VersionIcon from '/src/images/version.png'

export const VersionsLink = (props: {product: Product}) => {
    return (
        <span>
            <NavLink to={`/products/${props.product.id}/versions`}>
                <img src={VersionIcon}/>
                Versions
            </NavLink>
        </span>
    )
}