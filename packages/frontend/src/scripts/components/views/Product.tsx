import * as React from 'react'
import { useEffect, useContext } from 'react'
import { NavLink } from 'react-router-dom'

import { Product } from 'productboard-common'

import { ProductClient } from '../../clients/rest/product'
import { UserContext } from '../../contexts/User'
import { VersionContext } from '../../contexts/Version'
import { useAsyncHistory } from '../../hooks/history'
import { useProducts } from '../../hooks/list'
//import { ProductCount } from '../counts/Products'
import { LegalFooter } from '../snippets/LegalFooter'
import { Column, Table } from '../widgets/Table'
import { ProductImageWidget } from '../widgets/ProductImage'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { MemberCount } from '../counts/Members'
import { IssueCount } from '../counts/Issues'
import { VersionCount } from '../counts/Versions'
import { LoadingView } from './Loading'

import ProductIcon from '/src/images/product.png'
import DeleteIcon from '/src/images/delete.png'

export const ProductView = () => {

    const { push } = useAsyncHistory()
    
    // CONTEXTS
    
    const { contextUser } = useContext(UserContext)
    const { setContextVersion } = useContext(VersionContext)

    // QUERIES

    const _public = new URLSearchParams(location.search).get('public') == 'false' ? 'false' : 'true'

    // HOOKS

    const products = useProducts(_public)

    // EFFECTS

    useEffect(() => { setContextVersion(undefined) })

    // FUNCTIONS

    async function deleteProduct(event: React.UIEvent, product: Product) {
        // TODO handle unmount!
        event.stopPropagation()
        if (confirm('Do you really want to delete this Product?')) {
            await ProductClient.deleteProduct(product.productId)
        }
    }

    // CONSTANTS
    
    const columns: Column<Product>[] = [
        { label: '📷', class: 'center', content: product => (
            <ProductImageWidget productId={product.productId}/>
        ) },
        { label: 'Name / Description', class: 'left fill', content: product => (
            <>
                <div>
                    <strong>{product.name}</strong>
                    {product.public ? (
                        <span className='badge public'>public</span>
                    ) : (
                        <span className='badge private'>private</span>
                    )}
                </div>
                <div>{product.description}</div>
            </>
        ) },
        { label: 'Versions', class: 'center', content: product => (
            <span className='badge'>
                <VersionCount productId={product.productId}/>
            </span>
        ) },
        { label: 'Issues', class: 'center', content: product => (
            <span className='badge'>
                <IssueCount productId={product.productId} state='open'/>
            </span>
        ) },
        { label: 'Members', class: 'center', content: product => (
            <span className='badge'>
                <MemberCount productId={product.productId}/>
            </span>
        ) },
        { label: '👤', class: 'center', content: product => (
            <ProductUserPictureWidget userId={product.userId} productId={product.productId} class='icon medium round'/>
        ) },
        { label: '🛠️', content: product => (
            <a onClick={event => deleteProduct(event, product)}>
                <img src={DeleteIcon} className='icon medium pad'/>
            </a>
        ) }
    ]

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
                            <Table columns={columns} items={products.map(p => p).reverse()} onClick={product => push(`/products/${product.productId}/versions`)}/>
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