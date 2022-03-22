import  * as React from 'react'
import { useState, useEffect, Fragment } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Redirect } from 'react-router'
// Commons
import { Product } from 'productboard-common'
// Managers
import { ProductManager } from '../../managers/product'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { ProductView3D } from '../widgets/ProductView3D'

export const MemberView = (props: RouteComponentProps<{product: string, member: string}>) => {
    const productId = props.match.params.product

    // Define entities
    const [product, setProduct] = useState<Product>()


    // Load entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])



    return (
        <main className="view extended product">
            { product && (
                 <Fragment>
                    { product && product.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className="sidebar">
                                <div>
                                
                                    TODO
                                    <h1>Settings</h1>
                                </div>
                                <div>
                                    <ProductView3D product={product} mouse={true}/>
                                </div>
                            </main>
                        </Fragment>
                    )}
                 </Fragment>
                
            )}
        </main>
    )
}