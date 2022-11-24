import { Product } from 'productboard-common'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { VersionManager } from '../../managers/version'

import * as VersionIcon from '/src/images/version.png'

export const VersionsLink = (props: {product: Product}) => {

    // STATES

    const [count, setCount] = useState<number>(VersionManager.getVersionCount(props.product.id))

    // EFFECTS

    useEffect(() => { VersionManager.findVersions(props.product.id).then(versions => setCount(versions.length)) }, [props])

    // RETURN

    return (
        <span>
            <NavLink to={`/products/${props.product.id}/versions`}>
                <img src={VersionIcon}/>
                Versions ({count != undefined ? count : '?'})
            </NavLink>
        </span>
    )

}