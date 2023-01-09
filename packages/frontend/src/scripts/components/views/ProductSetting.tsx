import * as React from 'react'
import { useState, useEffect, useContext, FormEvent, Fragment } from 'react'
import { Redirect, useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'

import { Product } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { VersionContext } from '../../contexts/Version'
import { ProductManager } from '../../managers/product'
import { TextInput } from '../inputs/TextInput'
import { ProductFooter } from '../snippets/ProductFooter'
import { ProductHeader } from '../snippets/ProductHeader'
import { ProductView3D } from '../widgets/ProductView3D'

export const ProductSettingView = (props: RouteComponentProps<{product: string}>) => {

    const history = useHistory()

    // CONTEXTS

    const contextUser = useContext(UserContext)
    const contextVersion = useContext(VersionContext)

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
                                    <ProductView3D product={product} version={contextVersion.id != undefined ? contextVersion : null} mouse={true} vr= {true} change = {contextVersion.update}/>
                                </div>
                            </main>
                            <ProductFooter 
                                item1={{'text':'Product settings','image':'setting', 'sidebar': sidebar , 'setSidebar': setSidebar, 'set': false }} 
                                item2={{'text':'3D model','image':'part', 'sidebar': sidebar, 'setSidebar': setSidebar, 'set': true }} 
                            />
                        </Fragment>
                    )}
                </Fragment>
            )}
        </main>
    )
}