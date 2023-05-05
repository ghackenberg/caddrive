import * as React from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { Product } from 'productboard-common'

import { useAsyncHistory } from '../../hooks/history'
import { useProductVersions } from '../../hooks/route'
import { PRODUCTS_4 } from '../../pattern'

import VersionIcon from '/src/images/version.png'

export const VersionsLink = (props: {product: Product}) => {

    const { pathname } = useLocation()
    const { go, goBack, replace } = useAsyncHistory()

    // HOOKS

    const { versions } = useProductVersions()

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
        await replace(`/products/${props.product.id}/versions`)
    }

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.id}/versions`} onClick={handleClick}>
                <img src={VersionIcon} className='icon small'/>
                <span>
                    <span>Versions</span>
                    <span>{versions ? versions.length : '?'}</span>
                </span>
            </NavLink>
        </span>
    )

}