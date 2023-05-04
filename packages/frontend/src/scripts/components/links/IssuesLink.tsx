import * as React from 'react'
import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { Product } from 'productboard-common'

import { useAsyncHistory } from '../../hooks/history'
import { IssueManager } from '../../managers/issue'
import { PRODUCTS_4 } from '../../pattern'

import IssueIcon from '/src/images/issue.png'

export const IssuesLink = (props: {product: Product}) => {
    const { pathname } = useLocation()
    const { goBack, replace } = useAsyncHistory()

    // INITIAL STATES

    const initialIssues = IssueManager.findIssuesFromCache(props.product.id)
    const initialCount = initialIssues ? initialIssues.length : undefined

    // STATES

    const [count, setCount] = useState<number>(initialCount)

    // EFFECTS

    useEffect(() => { IssueManager.findIssues(props.product.id).then(issues => setCount(issues.length)) }, [props])

    // FUNCTIONS

    async function handleClick(event: React.UIEvent) {
        event.preventDefault()
        if (PRODUCTS_4.test(pathname)) {
            await goBack()
        }
        await replace(`/products/${props.product.id}/issues`)
    }

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.id}/issues`} onClick={handleClick}>
                <img src={IssueIcon} className='icon small'/>
                <span>
                    <span>Issues</span>
                    <span>{count != undefined ? count : '?'}</span>
                </span>
            </NavLink>
        </span>
    )

}