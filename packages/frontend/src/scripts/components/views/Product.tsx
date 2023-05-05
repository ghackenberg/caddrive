import * as React from 'react'
import { useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'

import { Product } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { VersionContext } from '../../contexts/Version'
import { useProducts } from '../../hooks/route'
import { ProductManager } from '../../managers/product'
import { LegalFooter } from '../snippets/LegalFooter'
import { Column, Table } from '../widgets/Table'
import { ProductImageWidget } from '../widgets/ProductImage'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { MemberCount } from '../counts/Members'
import { IssueCount } from '../counts/Issues'
import { VersionCount } from '../counts/Versions'
import { LoadingView } from './Loading'

import DeleteIcon from '/src/images/delete.png'

export const ProductView = () => {
    
    // CONTEXTS
    
    const { contextUser } = useContext(UserContext)
    const { setContextVersion } = useContext(VersionContext)

    // HOOKS

    const products = useProducts()

    console.log(products)

    // EFFECTS

    useEffect(() => { setContextVersion(undefined) })

    // FUNCTIONS

    async function deleteProduct(product: Product) {
        // TODO handle unmount!
        if (confirm('Do you really want to delete this Product?')) {
            await ProductManager.deleteProduct(product.id)
        }
    }

    // CONSTANTS
    
    const columns: Column<Product>[] = [
        { label: '📷', class: 'center', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                <ProductImageWidget productId={product.id}/>
            </Link>
        ) },
        { label: 'Name', class: 'left nowrap', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                {product.name}
            </Link>
        ) },
        { label: 'Description', class: 'left fill', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                {product.description}
            </Link>
        ) },
        { label: 'Versions', class: 'center', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                <VersionCount productId={product.id}/>
            </Link>
        ) },
        { label: 'Issues', class: 'center', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                <IssueCount productId={product.id} state='open'/>
            </Link>
        ) },
        { label: 'Members', class: 'center', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                <MemberCount productId={product.id}/>
            </Link>
        ) },
        { label: '👤', class: 'center', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                <ProductUserPictureWidget userId={product.userId} productId={product.id} class='icon medium round'/>
            </Link>
        ) },
        { label: '🛠️', content: product => (
            <a onClick={() => deleteProduct(product)}>
                <img src={DeleteIcon} className='icon medium pad'/>
            </a>
        ) }
    ]

    // RETURN

    return (
        products ? (
            <main className="view product">
                <div>
                    <div>
                        {contextUser ? (
                            <Link to='/products/new/settings' className='button fill green'>
                                New product
                            </Link>
                        ) : (
                            <a className='button fill green' style={{fontStyle: 'italic'}}>
                                New product (requires login)
                            </a>
                        )}
                        <Table columns={columns} items={products.map(p => p).reverse()}/>
                    </div>
                    <LegalFooter/>
                </div>
            </main>
        ) : (
            <LoadingView/>
        )
    )

}