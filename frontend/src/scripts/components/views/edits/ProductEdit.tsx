import * as React from 'react'
import { useState, useEffect, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
// Commons
import { Product } from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI } from '../../../clients/rest'
// Links
import { ProductLink } from '../../links/ProductLink'
// Inputs
import { TextInput } from '../../inputs/TextInput'

export const ProductEditView = (props: RouteComponentProps<{product: string}>) => {

    const productId = props.match.params.product

    const history = useHistory()

    // Define entities
    const [product, setProduct] = useState<Product>()

    // Define values
    const [name, setName] = useState<string>('')

    // Load entities
    useEffect(() => { productId == 'new' || ProductAPI.getProduct(productId).then(setProduct) }, [props])

    // Load values
    useEffect(() => { product && setName(product.name) }, [product])

    async function submit(event: FormEvent){
        event.preventDefault()
        if(productId == 'new') {
            if (name) {
                const product = await ProductAPI.addProduct({ name })
                history.replace(`/versions?product=${product.id}`)
            }
        } else {
            if (name) {
                await ProductAPI.updateProduct(product.id, { name })
                history.replace(`/versions?product=${product.id}`)
            }
        }
    }

    async function reset() {
        history.goBack()
    }

    return (
        <div className="view product">
            { (productId == 'new' || product) && (
                <React.Fragment>
                    <header>
                        <nav>
                            <ProductLink product={product}/>
                        </nav>
                    </header>
                    <main>
                        <div>
                            <h1>{product ? product.name : 'New product'}</h1>
                            <form onSubmit={submit} onReset={reset} className='data-input'>
                                <TextInput label='Name' placeholder='Type name' value={name} change={setName}/>
                                <div>
                                    <div/>
                                    <div>
                                        { productId == 'new' && <input type='reset' value='Cancel'/> }
                                        <input type='submit' value='Save'/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </main>
                </React.Fragment>
            )}
        </div>
    )
}