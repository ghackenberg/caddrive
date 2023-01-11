import * as React from 'react'
import { useState, useEffect, useContext, FormEvent, Fragment } from 'react'
import { Redirect, useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'

import { Product } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { ProductManager } from '../../managers/product'
import { SubmitInput } from '../inputs/SubmitInput'
import { TextInput } from '../inputs/TextInput'
import { ProductFooter, ProductFooterItem } from '../snippets/ProductFooter'
import { ProductHeader } from '../snippets/ProductHeader'
import { ProductView3D } from '../widgets/ProductView3D'

import * as LeftIcon from '/src/images/setting.png'
import * as RightIcon from '/src/images/part.png'

export const ProductSettingView = (props: RouteComponentProps<{product: string}>) => {

    const { replace } = useHistory()

    // CONTEXTS

    const { contextUser } = useContext(UserContext)

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
    const [active, setActive] = useState<string>('left')
    
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
                replace(`/products/${product.id}`)
            }
        } else {
            if (name && description) {
                setProduct(await ProductManager.updateProduct(product.id, { name, description }))
            }
        }
    }

    // CONSTANTS

    const items: ProductFooterItem[] = [
        { name: 'left', text: 'Form view', image: LeftIcon },
        { name: 'right', text: 'Model view', image: RightIcon }
    ]

    // RETURN

    return (
        <main className="view extended product">
            {(productId == 'new' || product) && (
                <Fragment>
                    {product && product.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <ProductHeader product={product}/>
                            <main className= {`sidebar ${active == 'left' ? 'hidden' : 'visible'}`}>
                                <div>
                                    <h1>Settings</h1>
                                    <form onSubmit={submit}>
                                        <TextInput label='Name' placeholder='Type name' value={name} change={setName}/>
                                        <TextInput label='Description' placeholder='Type description' value={description} change={setDescription}/>
                                        <SubmitInput/>
                                    </form>
                                </div>
                                <div>
                                    <ProductView3D product={product} mouse={true} vr={true}/>
                                </div>
                            </main>
                            <ProductFooter items={items} active={active} setActive={setActive}/>
                        </Fragment>
                    )}
                </Fragment>
            )}
        </main>
    )
}