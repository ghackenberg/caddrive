import * as React from 'react'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { Product } from 'productboard-common'

import { MemberManager } from '../../managers/member'

import MemberIcon from '/src/images/user.png'

export const MembersLink = (props: {product: Product}) => {

    // STATES

    const [count, setCount] = useState<number>(MemberManager.getMemberCount(props.product.id))

    // EFFECTS

    useEffect(() => { MemberManager.findMembers(props.product.id).then(members => setCount(members.length)) }, [props])

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.id}/members`}>
                <img src={MemberIcon} className='icon small'/>
                <span>
                    <span>Members</span>
                    <span>{count != undefined ? count : '?'}</span>
                </span>
            </NavLink>
        </span>
    )

}