import * as React from 'react'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
// Commons
import { Product } from 'productboard-common'
// Managers
import { MemberManager } from '../../managers/member'
// Images
import * as MilestoneIcon from '/src/images/milestone.png'

export const MilestonesLink = (props: {product: Product}) => {

    const [count, setCount] = useState<number>()

    // TODO: Find Milestones und unten count übergeben
    useEffect(() => { MemberManager.findMembers(props.product.id).then(members => setCount(members.length)) }, [props])

    return (
        <span>
            <NavLink to={`/products/${props.product.id}/milestones`}>
                <img src={MilestoneIcon}/>
                Milestones ({count != undefined ? /*count*/ 0 : '?'})
            </NavLink>
        </span>
    )

}