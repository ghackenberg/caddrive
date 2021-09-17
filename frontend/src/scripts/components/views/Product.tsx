import * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
import { Product, Version } from '../../data'
import { ProductAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { ProductVersionList } from '../widgets/ProductVersionList'
import { TextInput } from './forms/InputForms'
import { ProductLink } from './forms/ProductLink'

export const ProductView = (props: RouteComponentProps<{product: string}>) => {

    const productId = props.match.params.product

    const history = useHistory()

    const [product, setProduct] = useState<Product>(null)
    const [versions, setVersions] = useState<Version[]>(null)
    const [productName, setProductName] = useState<string>(null)

    useEffect(() => { VersionAPI.findVersions(null, productId).then(setVersions) }, [])

    if (productId != 'new') {
        useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [])
    }

    async function saveProduct(event: FormEvent){
        event.preventDefault()

        if(productId == 'new') {
            if (productName != '') {
                await ProductAPI.addProduct({name: productName})

                history.goBack()
            }
        }
        else {
            if (productName != '') {
                await ProductAPI.updateProduct({id: productId, name: productName})

                history.goBack()
            }
        }
    }

    async function cancelInput() {
        history.goBack()
    }

    return (
        <div className="view product">
            <Header/>
            <Navigation/>
                <main>
                    { productId == 'new' || product ? (
                        <Fragment>
                            <nav>
                                { product ? <ProductLink product={product}/> : <ProductLink/> }
                            </nav>
                            <h1>{ productId == 'new' ? 'Add new product' : 'Change existing product' }</h1>
                            <form onSubmit={saveProduct} onReset={cancelInput} className='user-input'>
                                <TextInput
                                    label='Product name:'
                                    placeholder={productId=='new' ? "Add here new product" : product.name}
                                    change={value => setProductName(value)}/>
                                <div>
                                    <div/>
                                    <div>
                                        <input type="reset" value='Cancel'/>
                                        <input type="submit" value="Save"/>
                                    </div>
                                </div>
                            </form>
                            { product && <h2>Available product versions:</h2> }
                            { product && versions ? 
                                <ProductVersionList product={product} list={versions}/> : product && <p>Loading...</p> 
                            }
                        </Fragment>
                    ) : (
                        <p>Loading...</p>
                    )}
                </main>
        </div>
    )
}