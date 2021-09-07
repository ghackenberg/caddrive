import * as React from 'react'
import { useRef, useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
import { Product, Version } from '../../data'
import { ProductAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { LinkSource } from '../widgets/LinkSource'
import { VersionList } from '../widgets/VersionList'

export const ProductView = (props: RouteComponentProps<{product: string}>) => {

    const productId = props.match.params.product

    const productInput = useRef<HTMLInputElement>(null)
    const history = useHistory()

    const [product, setProduct] = useState<Product>(null)
    const [versions, setVersions] = useState<Version[]>(null)

    useEffect(() => { VersionAPI.findAll(productId).then(setVersions) }, [])

    if (productId != 'new') {
        useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [])
    }

    async function saveProduct(event: FormEvent){
        event.preventDefault()

        if(productId == 'new') {
            if (productInput.current.value != '') {
                await ProductAPI.addProduct({name: productInput.current.value})

                history.goBack()
            }
        }
        else {
            if (productInput.current.value != '') {
                await ProductAPI.updateProduct({id: productId, name: productInput.current.value})

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
                                { product ? (
                                <LinkSource object={product} id={product.id} name={product.name} type={'Product'}/>  
                                ) : (
                                    <LinkSource object={'new'} id={'new'} name={'new'} type={'Product'}/>  
                                )} 
                            </nav>
                            <h1>{ productId == 'new' ? 'Add new product' : 'Change existing product' }</h1>
                            <form onSubmit={saveProduct} onReset={cancelInput} className='user-input'>
                                <div>
                                    <div>
                                        <label>Product name:</label> 
                                    </div>
                                    <div>
                                        <input ref={productInput} placeholder={ productId=='new' ? "Add here new product" : product.name }/>
                                    </div>
                                </div>
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
                                <VersionList product={product} list={versions}/> : product && <p>Loading...</p> 
                            }
                        </Fragment>
                    ) : (
                        <p>Loading...</p>
                    )}
                </main>
        </div>
    )
}