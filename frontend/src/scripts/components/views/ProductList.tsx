import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { Product } from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI } from '../../clients/rest'
// Snippets
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
// Links
import { ProductsLink } from '../links/ProductsLink'
// Widgets
import { ProductSearchBar } from '../widgets/SearchBar'
import { Column, Table } from '../widgets/Table'
// Images
import * as ProductIcon from '/src/images/product.png'
import * as DeleteIcon from '/src/images/delete.png'

export const ProductListView = () => {
    
    // Define entities
    const [products, setProducts] = useState<Product[]>()

    // Load entities
    useEffect(() => { ProductAPI.findProducts().then(setProducts) }, [])

    const columns: Column<Product>[] = [
        {label: 'Icon', content: _product => <img src={ProductIcon} style={{width: '1em'}}/>},
        {label: 'Product', content: product => <Link to={`/products/${product.id}`}>{product.name}</Link>},
        {label: 'Delete', content: _product => <a href="#" onClick={_event => {}}><img src={DeleteIcon} style={{width: '1em', height: '1em'}}/></a>}
    ]

    return (
        <div className="view products">
            <Header/>
            <Navigation/>
            <main>
                <nav>
                    <ProductsLink/>
                </nav>
                <h1>Product list (<Link to={`/products/new`}>+</Link>)</h1>
                <ProductSearchBar change={setProducts}/>
                { products && <Table columns={columns} items={products}/> }
            </main>
        </div>
    )

}