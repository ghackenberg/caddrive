import * as React from 'react'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { Product } from 'productboard-common'

import { IssueManager } from '../../managers/issue'

import IssueIcon from '/src/images/issue.png'

export const IssuesLink = (props: {product: Product}) => {

    // STATES

    const [count, setCount] = useState<number>(IssueManager.getIssueCount(props.product.id))

    // EFFECTS

    useEffect(() => { IssueManager.findIssues(props.product.id).then(issues => setCount(issues.length)) }, [props])

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.id}/issues`}>
                <img src={IssueIcon} className='icon small'/>
                <span>
                    <span>Issues</span>
                    <span>{count != undefined ? count : '?'}</span>
                </span>
            </NavLink>
        </span>
    )

}