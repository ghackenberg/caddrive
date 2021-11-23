import * as React from 'react'
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
// Commons
import { Product } from 'fhooe-audit-platform-common'
// Images
import * as VersionIcon from '/src/images/version.png'
import { VersionAPI } from '../../clients/rest'

export const VersionsLink = (props: {product: Product}) => {

    const [count, setCount] = useState<number>()

    useEffect(() => { VersionAPI.findVersions(props.product.id).then(versions => setCount(versions.length)) }, [props])

    return (
        <span>
            <NavLink to={`/products/${props.product.id}/versions`}>
                <img src={VersionIcon}/>
                Versions ({count != undefined ? count : '?'})
            </NavLink>
        </span>
    )

}