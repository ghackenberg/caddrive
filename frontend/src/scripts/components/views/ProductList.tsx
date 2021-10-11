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
import * as DeleteIcon from '/src/images/delete.png'

export const ProductListView = () => {
    
    const [products, setProducts] = useState<Product[]>()

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
                <Fragment>
                    <nav>
                        <span>
                            <Link to="/">Home</Link>
                        </span>
                        <span>
                            <a>Products</a>
                        </span>
                    </nav>
                </Fragment>
                <h1>Product list (<Link to={`/products/new`}>+</Link>)</h1>
                <ProductSearchBar change={setProducts}/>
                {products && <Table columns={columns} items={products}/>}
            </main>
        </div>
    )
}