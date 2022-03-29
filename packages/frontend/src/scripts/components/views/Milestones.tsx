import { Product } from 'productboard-common'
import  * as React from 'react'
import { Fragment, useEffect, useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { ProductManager } from '../../managers/product'
import { ProductHeader } from '../snippets/ProductHeader'


export const MilestonesView = (props: RouteComponentProps<{product: string}>) => {

    const productId = props.match.params.product
   
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
                                </div>
                            </main>
                        </Fragment>
                    )}
                 </Fragment>
                
            )}
        </main>
    )
}