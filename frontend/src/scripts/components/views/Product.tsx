import * as React from 'react'
import { useRef, useState, useEffect, Fragment } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
import { ProductData, Version } from '../../data'
import { ProductAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { VersionList } from '../widgets/VersionList'

export const Product = (props: RouteComponentProps<{id: string}>) => {

    const id = props.match.params.id

    const [product, setProduct] = useState<ProductData>(null)
    const [versions, setVersion] = useState<Version[]>(null)

    useEffect(() => { VersionAPI.findAll().then(setVersion) }, [])

    if (id != 'new') {
        useEffect(() => { ProductAPI.getProduct(id).then(setProduct) }, [])
    }

    const productInput = useRef<HTMLInputElement>(null)
    const history = useHistory()

    async function saveProduct(){
        if(id == 'new') {
            if (productInput.current.value != '') {
                await ProductAPI.addProduct({name: productInput.current.value})

                history.goBack()
            }
        }
        else {
            if (productInput.current.value != '') {
                await ProductAPI.updateProduct({id: id, name: productInput.current.value})

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
                <h1><Link to="/">Welcome Page</Link> &rsaquo; <Link to="/products">Products</Link> &rsaquo; {id} Product</h1>
                {id == 'new' ? (<h2>Add new Product</h2>) : (<h2>Change existing Product</h2>)}
                {id == 'new' || product != null ? (
                    <Fragment>
                        <label>
                            Product name: <br></br>
                            <input ref={productInput} placeholder={ id=='new' ? "Add here new product" : product.name}></input><br></br>
                        </label>
                        <button onClick={cancelInput}>Cancel</button>
                        <button onClick={saveProduct} >Save</button>
                        <h2>Available product versions:</h2>
                        {versions ? <VersionList list={versions}/> : <p>Loading...</p>}
                    </Fragment>
                    ) : (
                        <p>Loading...</p>
                    )}
            </main>
        </div>
    )
}