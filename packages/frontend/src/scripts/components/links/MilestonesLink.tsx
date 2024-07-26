import * as React from 'react'
import { NavLink } from 'react-router-dom'

import { ProductRead } from 'productboard-common'

import { useNavigationStack } from '../../hooks/navigation'

import MilestoneIcon from '/src/images/milestone.png'

export const MilestonesLink = (props: {product: ProductRead}) => {

    // NAVIGATION

    const { navigate } = useNavigationStack()

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.productId}/milestones`} onClick={navigate}>
                <img src={MilestoneIcon} className='icon small'/>
                <span className='label'>Milestones</span>
                <span className='badge'>{props.product.openMilestoneCount}</span>
            </NavLink>
        </span>
    )

}