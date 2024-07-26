import * as React from 'react'
import { NavLink, useParams } from 'react-router-dom'

import { useNavigationStack } from '../../hooks/navigation'
import { useProduct } from '../../hooks/entity'
import { IssuesLink } from '../links/IssuesLink'
import { MembersLink } from '../links/MembersLink'
import { MilestonesLink } from '../links/MilestonesLink'
import { ProductLink } from '../links/ProductLink'
import { VersionsLink } from '../links/VersionsLink'

import SettingIcon from '/src/images/setting.png'

export const ProductHeader = () => {

    // NAVIGATION

    const { navigate } = useNavigationStack()

    // PARAMS

    const { productId } = useParams<{ productId: string }>()

    // ENTITIES

    const product = useProduct(productId)

    // RETURN

    return (
        <header className='view product'>
            <div className='entity'>
                <ProductLink product={product}/>
                {product && (
                    product.public ? (
                        <span className='badge public'>public</span>
                    ) : (

                        <span className='badge private'>private</span>
                    )
                )}
            </div>
            <div className='tabs'>
                {product && (
                    <>
                        <VersionsLink product={product}/>
                        <IssuesLink product={product}/>
                        <MilestonesLink product={product}/>
                        <MembersLink product={product}/>
                    </>
                )}
                <span>
                    {productId == 'new' ? (
                        <a className="active">
                            <img src={SettingIcon} className='icon small'/>
                            <span>Settings</span>
                        </a>
                    ) : (
                        <NavLink to={`/products/${productId}/settings`} onClick={navigate}>
                            <img src={SettingIcon} className='icon small'/>
                            <span>Settings</span>
                        </NavLink>
                    )}
                </span>
            </div>
        </header>
    )
}