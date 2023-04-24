import * as React from 'react'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { Product } from 'productboard-common'

import { VersionManager } from '../../managers/version'

import VersionIcon from '/src/images/version.png'

export const VersionsLink = (props: {product: Product}) => {

    // INITIAL STATES

    const initialVersions = VersionManager.findVersionsFromCache(props.product.id)
    const initialCount = initialVersions ? initialVersions.length : undefined

    // STATES

    const [count, setCount] = useState<number>(initialCount)

    // EFFECTS

    useEffect(() => { VersionManager.findVersions(props.product.id).then(versions => setCount(versions.length)) }, [props])

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.id}/versions`}>
                <img src={VersionIcon} className='icon small'/>
                <span>
                    <span>Versions</span>
                    <span>{count != undefined ? count : '?'}</span>
                </span>
            </NavLink>
        </span>
    )

}