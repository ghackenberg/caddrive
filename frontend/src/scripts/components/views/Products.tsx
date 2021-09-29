import { Product } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ProductAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { ProductList } from '../widgets/ProductList'
import { ProductSearchBar } from '../widgets/SearchBar'

export const ProductsView = () => {
    
    const [products, setProducts] = useState<Product[]>()

    useEffect(() => { ProductAPI.findProducts().then(setProducts) }, [])

    return (
        <div className="view products">
            <Header/>
            <Navigation/>
            <main>
                <Fragment>
                    <nav>
                        <span>
                            <Link to="/">Welcome Page</Link>
                        </span>
                        <span>
                            <a>Products</a>
                        </span>
                    </nav>
                </Fragment>
                <h2>Available products</h2>
                <ProductSearchBar change={setProducts}/>
                {products ? <ProductList list={products}/> : <p>Loading...</p>}
            </main>
        </div>
    )
}