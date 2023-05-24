import * as React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { Product } from 'productboard-common'

import { useAsyncHistory } from '../../hooks/history'
import { useTags } from '../../hooks/list'
import { PRODUCTS_4 } from '../../pattern'

import TagIcon from '/src/images/tag.png'

export const TagsLink = (props: {product: Product}) => {

    const { pathname } = useLocation()
    const { go, goBack, replace } = useAsyncHistory()

    // HOOKS

    const tags = useTags(props.product.id)

    // FUNCTIONS

    async function handleClick(event: React.UIEvent) {
        event.preventDefault()
        const products4 = PRODUCTS_4.exec(pathname)
        if (products4) {
            if (products4[2] == 'issues' && products4[3] != 'new' && products4[4] == 'settings') {
                await go(-2)
            } else if (products4[2] == 'milestones' && products4[3] != 'new' && products4[4] == 'settings') {
                await go(-2)
            } else {
                await goBack()
            }
        }
        await replace(`/products/${props.product.id}/tags`)
    }

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.id}/tags`} onClick={handleClick}>
                <img src={TagIcon} className='icon small'/>
                <span className='label'>Tags</span>
                <span className='badge'>{tags ? tags.length : '?'}</span>
            </NavLink>
        </span>
    )

}