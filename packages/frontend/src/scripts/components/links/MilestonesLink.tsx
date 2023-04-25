import * as React from 'react'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { Product } from 'productboard-common'

import { MilestoneManager } from '../../managers/milestone'

import MilestoneIcon from '/src/images/milestone.png'

export const MilestonesLink = (props: {product: Product}) => {

    // INITIAL STATES

    const initialMilestones = MilestoneManager.findMilestonesFromCache(props.product.id)
    const initialCount = initialMilestones ? initialMilestones.length : undefined

    // STATES

    const [count, setCount] = useState<number>(initialCount)

    // EFFECTS

    // TODO: Find Milestones und unten count übergeben
    useEffect(() => { MilestoneManager.findMilestones(props.product.id).then(milestones => setCount(milestones.length)) }, [props])

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.id}/milestones`}>
                <img src={MilestoneIcon} className='icon small'/>
                <span>
                    <span>Milestones</span>
                    <span>{count != undefined ? count : '?'}</span>
                </span>
            </NavLink>
        </span>
    )

}