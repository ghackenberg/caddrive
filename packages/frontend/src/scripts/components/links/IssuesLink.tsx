import * as React from 'react'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
// Commons
import { Product } from 'productboard-common'
// Managers
import { IssueManager } from '../../managers/issue'
// Images
import * as IssueIcon from '/src/images/issue.png'

export const IssuesLink = (props: {product: Product}) => {

    // STATES

    const [count, setCount] = useState<number>()

    // EFFECTS

    useEffect(() => { IssueManager.findIssues(props.product.id).then(issues => setCount(issues.length)) }, [props])

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.id}/issues`}>
                <img src={IssueIcon}/>
                Issues ({count != undefined ? count : '?'})
            </NavLink>
        </span>
    )

}