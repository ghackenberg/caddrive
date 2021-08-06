import * as React from 'react'
import { useRef } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
import { ProductAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export const Product = (props: RouteComponentProps<{id: string}>) => {

    const textInput = useRef<HTMLInputElement>(null)
    const placeholderProduct = props.match.params.id
    const history = useHistory()

    async function saveProduct(){
        if(props.match.params.id == 'new')
            if (textInput.current.value != '')
                await ProductAPI.addProduct({id: textInput.current.value})
        else
            if (textInput.current.value != '')
                await ProductAPI.updateProduct({id: textInput.current.value})
            else
                await ProductAPI.updateProduct({id: props.match.params.id})

        history.goBack()
    }

    async function cancelInput() {
        history.goBack()
    }

    return (
        <div className="view product">
            <Header/>
            <Navigation/>
            <main>
                <h1><Link to="/">Welcome Page</Link> &rsaquo; <Link to="/products">Products</Link> &rsaquo; {props.match.params.id} Product</h1>
                <input ref={textInput} placeholder={ props.match.params.id=='new' ? "Add here new product" : placeholderProduct}></input><br></br>
                <button onClick={cancelInput}>Cancel</button>
                <button onClick={saveProduct}>Save</button>
            </main>
        </div>
    )
}