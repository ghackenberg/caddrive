import * as React from 'react'
import { NavLink } from 'react-router-dom'

import { ProductRead } from 'productboard-common'

import { useNavigationStack } from '../../hooks/navigation'

import VersionIcon from '/src/images/version.png'

export const VersionsLink = (props: {product: ProductRead}) => {

    // NAVIGATION

    const { navigate } = useNavigationStack()

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.productId}/versions`} onClick={navigate}>
                <img src={VersionIcon} className='icon small'/>
                <span className='label'>Versions</span>
                <span className='badge'>{props.product.versionCount}</span>
            </NavLink>
        </span>
    )

}