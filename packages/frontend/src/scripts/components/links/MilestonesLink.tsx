import * as React from 'react'
import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { Product } from 'productboard-common'

import { useAsyncHistory } from '../../hooks/history'
import { MilestoneManager } from '../../managers/milestone'
import { PRODUCTS_4 } from '../../pattern'

import MilestoneIcon from '/src/images/milestone.png'

export const MilestonesLink = (props: {product: Product}) => {
    const { pathname } = useLocation()
    const { goBack, replace } = useAsyncHistory()

    // INITIAL STATES

    const initialMilestones = MilestoneManager.findMilestonesFromCache(props.product.id)
    const initialCount = initialMilestones ? initialMilestones.length : undefined

    // STATES

    const [count, setCount] = useState<number>(initialCount)

    // EFFECTS

    // TODO: Find Milestones und unten count übergeben
    useEffect(() => { MilestoneManager.findMilestones(props.product.id).then(milestones => setCount(milestones.length)) }, [props])

    // FUNCTIONS

    async function handleClick(event: React.UIEvent) {
        event.preventDefault()
        if (PRODUCTS_4.test(pathname)) {
            await goBack()
        }
        await replace(`/products/${props.product.id}/milestones`)
    }

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.id}/milestones`} onClick={handleClick}>
                <img src={MilestoneIcon} className='icon small'/>
                <span>
                    <span>Milestones</span>
                    <span>{count != undefined ? count : '?'}</span>
                </span>
            </NavLink>
        </span>
    )

}