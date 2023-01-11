import * as React from 'react'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { Product } from 'productboard-common'

import { MilestoneManager } from '../../managers/milestone'

import * as MilestoneIcon from '/src/images/milestone.png'

export const MilestonesLink = (props: {product: Product}) => {

    // STATES

    const [count, setCount] = useState<number>(MilestoneManager.getMilestoneCount(props.product.id))

    // EFFECTS

    // TODO: Find Milestones und unten count übergeben
    useEffect(() => { MilestoneManager.findMilestones(props.product.id).then(milestones => setCount(milestones.length)) }, [props])

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.id}/milestones`}>
                <img src={MilestoneIcon} className='icon small'/>
                <span>Milestones ({count != undefined ? count : '?'})</span>
            </NavLink>
        </span>
    )

}