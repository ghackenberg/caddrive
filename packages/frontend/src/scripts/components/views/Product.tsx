import * as React from 'react'
import { useState, useEffect, useContext, FormEvent, Fragment } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
// Commons
import { Product } from 'productboard-common'
// Clients
import { ProductAPI } from '../../clients/rest'
// Contexts
import { UserContext } from '../../contexts/User'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Inputs
import { TextInput } from '../inputs/TextInput'
// Widgets
import { ProductView as ProductView3D } from '../widgets/ProductView'

export const ProductView = (props: RouteComponentProps<{product: string}>) => {

    const productId = props.match.params.product

    const history = useHistory()

    const user = useContext(UserContext)

    // Define entities
    const [product, setProduct] = useState<Product>()

    // Define values
    const [name, setName] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [deleted, setDeleted] = useState<boolean>()

    // Load entities
    useEffect(() => { productId != 'new' && ProductAPI.getProduct(productId).then(setProduct) }, [props])

    // Load values
    useEffect(() => { product && setName(product.name) }, [product])
    useEffect(() => { product && setDescription(product.description) }, [product])
    useEffect(() => { product && setDeleted(product.deleted) }, [product])

    async function submit(event: FormEvent){
        event.preventDefault()
        if(productId == 'new') {
            if (name && description) {
                const product = await ProductAPI.addProduct({userId: user.id, name, description, deleted})
                history.replace(`/products/${product.id}`)
            }
        } else {
            if (name && description) {
                setProduct(await ProductAPI.updateProduct(product.id, { ...product, name, description }))
            }
        }
    }

    return (
        <main className="view extended product">
            { (productId == 'new' || product) && (
                <Fragment>
                    <ProductHeader product={product}/>
                    <main className="sidebar">
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
                            <ProductView3D product={product} mouse={true}/>
                        </div>
                    </main>
                </Fragment>
            )}
        </main>
    )
}