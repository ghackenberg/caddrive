import * as React from 'react'
import { useEffect, useContext } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

import { UserContext } from '../../contexts/User'
import { VersionContext } from '../../contexts/Version'
import { useProducts } from '../../hooks/list'
import { LegalFooter } from '../snippets/LegalFooter'
import { ProductImageWidget } from '../widgets/ProductImage'
import { ProductUserName } from '../values/ProductUserName'
import { ProductUserPicture } from '../values/ProductUserPicture'
import { LoadingView } from './Loading'

import ProductIcon from '/src/images/product.png'

export const ProductView = () => {
    
    // CONTEXTS
    
    const { contextUser } = useContext(UserContext)
    const { setContextVersion } = useContext(VersionContext)

    // LOCATION

    const { search } = useLocation()

    // QUERY

    const _public = new URLSearchParams(search).get('public') == 'false' ? 'false' : 'true'

    // ENTITIES

    const products = useProducts(_public)

    // EFFECTS

    useEffect(() => { setContextVersion(undefined) })

    // RETURN

    return (
        <main className="view product">
            <div>
                <div className='header'>
                    {contextUser ? (
                        <NavLink to={`/products/new/settings?public=${_public}`} className='button fill green block-when-responsive'>
                            <strong>New</strong> product
                        </NavLink>
                    ) : (
                        <NavLink to='/auth/email' className='button fill green block-when-responsive'>
                            <strong>New</strong> product <span className='badge'>requires login</span>
                        </NavLink>
                    )}
                    <NavLink to='/products?public=true' replace={true} className={`button ${_public == 'true' ? 'fill' : 'stroke'} blue`}>
                        <strong>Public</strong> products{/* <span className='badge'><ProductCount public='true'/></span>*/}
                    </NavLink>
                    <NavLink to='/products?public=false' replace={true} className={`button ${_public == 'false' ? 'fill' : 'stroke'} blue`}>
                        <strong>Private</strong> products{/* <span className='badge'><ProductCount public='false'/></span>*/}
                    </NavLink>
                </div>
                { products ? (
                    products.length == 0 ? (
                        <div className='main center'>
                            <div>
                                <img src={ProductIcon}/>
                                <p>No <strong>{_public == 'true' ? 'public' : 'private'}</strong> products found.</p>
                            </div>
                        </div>
                    ) : (
                        <div className='main'>
                            <div className='widget product_list'>
                                {products.reverse().map(product => (
                                    <NavLink key={product.productId} to={`/products/${product.productId}`}>
                                        <ProductImageWidget productId={product.productId}/>
                                        <div className="product">
                                            <h2>
                                                {product.name}
                                            </h2>
                                            <p>
                                                {product.description}
                                            </p>
                                        </div>
                                        <div className="count">
                                            {product.versionCount > 0 && <span className="badge">{product.versionCount} version{product.versionCount > 1 && 's'}</span>}
                                            {product.openIssueCount > 0 && <span className="badge">{product.openIssueCount} issue{product.openIssueCount > 1 && 's'}</span>}
                                            {product.openMilestoneCount > 0 && <span className="badge">{product.openMilestoneCount} milestone{product.openMilestoneCount > 1 && 's'}</span>}
                                            {product.memberCount > 1 && <span className="badge">{product.memberCount} members</span>}
                                        </div>
                                        <div className="user">
                                            <ProductUserPicture class='icon small round' productId={product.productId} userId={product.userId}/>
                                            <ProductUserName productId={product.productId} userId={product.userId}/>
                                        </div>
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    )
                ) : (
                    <LoadingView/>
                ) }
                <LegalFooter/>
            </div>
        </main>
    )

}