import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { Product } from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI } from '../../clients/rest'
// Links
import { HomeLink } from '../links/HomeLink'
// Widgets
import { Column, Table } from '../widgets/Table'
import { ProductView } from '../widgets/ProductView'
// Images
import * as AddIcon from '/src/images/add.png'
import * as ProductIcon from '/src/images/product.png'

export const ProductsView = () => {
    
    // Define entities
    const [products, setProducts] = useState<Product[]>()

    // Load entities
    useEffect(() => { ProductAPI.findProducts().then(setProducts) }, [])

    const columns: Column<Product>[] = [
        {label: '', content: product => <Link to={`/products/${product.id}`}><img src={ProductIcon}/></Link>},
        {label: 'Model', content: product => <Link to={`/products/${product.id}`}><ProductView id={product.id} mouse={false}/></Link>},
        {label: 'Product', content: product => <Link to={`/products/${product.id}`}>{product.name}</Link>},
        {label: '', content: () => '', class: 'fill'}
    ]

    return (
        <div className="view products">
            <header>
                <nav>
                    <HomeLink/>
                </nav>
            </header>
            <main>
                <div>
                    <h1>
                        <Link to={`/products`}>Products</Link>
                    </h1>
                    <Link to={`/products/new`}>
                        <img src={AddIcon}/>
                    </Link>
                    { products && <Table columns={columns} items={products}/> }
                </div>
            </main>
        </div>
    )

}