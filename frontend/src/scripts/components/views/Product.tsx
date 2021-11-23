import * as React from 'react'
import { useState, useEffect, useContext, FormEvent, Fragment } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
// Commons
import { Product } from 'fhooe-audit-platform-common'
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

    // Load entities
    useEffect(() => { productId != 'new' && ProductAPI.getProduct(productId).then(setProduct) }, [props])

    // Load values
    useEffect(() => { product && setName(product.name) }, [product])

    async function submit(event: FormEvent){
        event.preventDefault()
        if(productId == 'new') {
            if (name) {
                const product = await ProductAPI.addProduct({ userId: user.id, name })
                history.replace(`/products/${product.id}`)
            }
        } else {
            if (name) {
                setProduct(await ProductAPI.updateProduct(product.id, { ...product, name }))
            }
        }
    }

    return (
        <main className="view product">
            { (productId == 'new' || product) && (
                <Fragment>
                    <ProductHeader product={product}/>
                    <main className="sidebar">
                        <div>
                            <form onSubmit={submit} className='data-input'>
                                <TextInput label='Name' placeholder='Type name' value={name} change={setName}/>
                                <div>
                                    <div/>
                                    <div>
                                        <input type='submit' value='Save'/>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div>
                            { product && <ProductView3D id={product.id} mouse={true}/> }
                        </div>
                    </main>
                </Fragment>
            )}
        </main>
    )
}