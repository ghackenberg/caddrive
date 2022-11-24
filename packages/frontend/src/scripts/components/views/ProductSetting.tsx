import { Product } from 'productboard-common'
import * as React from 'react'
import { useState, useEffect, useContext, FormEvent, Fragment } from 'react'
import { Redirect, useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'

import { UserContext } from '../../contexts/User'
import { ProductManager } from '../../managers/product'
import { TextInput } from '../inputs/TextInput'
import { ProductFooter } from '../snippets/ProductFooter'
import { ProductHeader } from '../snippets/ProductHeader'
import { ProductView3D } from '../widgets/ProductView3D'

export const ProductSettingView = (props: RouteComponentProps<{product: string}>) => {

    const history = useHistory()

    // CONTEXTS

    const contextUser = useContext(UserContext)

    // PARAMS

    const productId = props.match.params.product

    // INITIAL STATES

    const initialProduct = productId == 'new' ? undefined : ProductManager.getProductFromCache(productId)
    const initialName = initialProduct ? initialProduct.name : ''
    const initialDescription = initialProduct ? initialProduct.description : ''

    // STATES

    // - Entities
    const [product, setProduct] = useState<Product>(initialProduct)
    // - Values
    const [name, setName] = useState<string>(initialName)
    const [description, setDescription] = useState<string>(initialDescription)
    // - Interactions
    const [sidebar, setSidebar] = useState<boolean>(false)
    
    // EFFECTS

    // - Entities
    useEffect(() => { productId != 'new' && ProductManager.getProduct(productId).then(setProduct) }, [props])
    // - Values
    useEffect(() => { product && setName(product.name) }, [product])
    useEffect(() => { product && setDescription(product.description) }, [product])

    // FUNCTIONS

    async function submit(event: FormEvent){
        event.preventDefault()
        if(productId == 'new') {
            if (name && description) {
                const product = await ProductManager.addProduct({userId: contextUser.id, name, description})
                history.replace(`/products/${product.id}`)
            }
        } else {
            if (name && description) {
                setProduct(await ProductManager.updateProduct(product.id, { name, description }))
            }
        }
    }

    // RETURN

    return (
        <main className="view extended product">
            { (productId == 'new' || product) && (
                <Fragment>
                    { product && product.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className= {`sidebar ${sidebar ? 'visible' : 'hidden'}`}>
                                <div>
                                    <h1>Settings</h1>
                                    <form onSubmit={submit}>
                                        <TextInput label='Name' placeholder='Type name' value={name} change={setName}/>
                                        <TextInput class='fill' label='Description' placeholder='Type description' value={description} change={setDescription}/>
                                        <div>
                                            <div/>
                                            <div>
                                                <input type='submit' value='Save'/>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div>
                                    <ProductView3D product={product} mouse={true} vr= {true}/>
                                </div>
                            </main>
                            <ProductFooter sidebar={sidebar} setSidebar={setSidebar} item1={{'text':'Product-Settings','image':'product'}} item2={{'text':'3D-Modell','image':'part'}}></ProductFooter>
                        </Fragment>
                    )}
                </Fragment>
            )}
        </main>
    )
}