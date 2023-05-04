import * as React from 'react'
import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { Product } from 'productboard-common'

import { useAsyncHistory } from '../../hooks/history'
import { MemberManager } from '../../managers/member'
import { PRODUCTS_4 } from '../../pattern'

import MemberIcon from '/src/images/user.png'

export const MembersLink = (props: {product: Product}) => {
    const { pathname } = useLocation()
    const { goBack, replace } = useAsyncHistory()

    // INITIAL STATES

    const initialMembers = MemberManager.findMembersFromCache(props.product.id)
    const initialCount = initialMembers ? initialMembers.length : undefined

    // STATES

    const [count, setCount] = useState<number>(initialCount)

    // EFFECTS

    useEffect(() => { MemberManager.findMembers(props.product.id).then(members => setCount(members.length)) }, [props])

    // FUNCTIONS

    async function handleClick(event: React.UIEvent) {
        event.preventDefault()
        if (PRODUCTS_4.test(pathname)) {
            await goBack()
        }
        await replace(`/products/${props.product.id}/members`)
    }

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.id}/members`} onClick={handleClick}>
                <img src={MemberIcon} className='icon small'/>
                <span>
                    <span>Members</span>
                    <span>{count != undefined ? count : '?'}</span>
                </span>
            </NavLink>
        </span>
    )

}