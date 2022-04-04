import { Product } from 'productboard-common'
import  * as React from 'react'
import { Fragment, useEffect, useState } from 'react'
import { Redirect, RouteComponentProps } from 'react-router'
import { ProductManager } from '../../managers/product'
import { ProductHeader } from '../snippets/ProductHeader'
import { ProductView3D } from '../widgets/ProductView3D'


export const MilestonesView = (props: RouteComponentProps<{product: string}>) => {

    // PARAMS

    const productId = props.match.params.product
   
    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>()

    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.getProduct(productId).then(setProduct) }, [props])

    // FUNCTIONS

    // TODO

    // CONSTANTS

    // TODO

    // RETURN

    return (
        <main className="view extended milestones">
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
                                <div>
                                    <ProductView3D product={product} mouse={true} vr= {true}/>
                                </div>
                            </main>
                        </Fragment>
                    )}
                 </Fragment>  
            )}
        </main>
    )
}