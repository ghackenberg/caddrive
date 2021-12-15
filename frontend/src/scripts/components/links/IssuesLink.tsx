import * as React from 'react'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
// Commons
import { Product } from 'productboard-common'
// Images
import * as IssueIcon from '/src/images/issue.png'
import { IssueAPI } from '../../clients/rest'

export const IssuesLink = (props: {product: Product}) => {

    const [count, setCount] = useState<number>()

    useEffect(() => { IssueAPI.findIssues(props.product.id).then(issues => setCount(issues.length)) }, [props])

    return (
        <span>
            <NavLink to={`/products/${props.product.id}/issues`}>
                <img src={IssueIcon}/>
                Issues ({count != undefined ? count : '?'})
            </NavLink>
        </span>
    )

}