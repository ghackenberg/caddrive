import { Product } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ProductAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { ProductSearchBar } from '../widgets/SearchBar'
import { Column, Table } from '../widgets/Table'
import * as ProductIcon from '/src/images/product.png'

export const ProductsView = () => {
    
    const [products, setProducts] = useState<Product[]>()

    useEffect(() => { ProductAPI.findProducts().then(setProducts) }, [])

    const columns: Column<Product>[] = [
        {label: 'Icon', content: _product => <img src={ProductIcon} style={{width: '1em'}}/>},
        {label: 'Product', content: product => <b>{product.name}</b>},
        {label: 'Link', content: product => <Link to={`/products/${product.id}`}>Details</Link>},
        {label: 'Link', content: product => <Link to={`/versions/?product=${product.id}`}>Versions</Link>}
    ]

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
                {products && <Table columns={columns} items={products} create='Product'/>}
            </main>
        </div>
    )
}