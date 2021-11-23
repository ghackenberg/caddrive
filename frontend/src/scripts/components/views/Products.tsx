import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { Product } from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI } from '../../clients/rest'
// Links
import { ProductsLink } from '../links/ProductsLink'
// Widgets
import { Column, Table } from '../widgets/Table'
import { ProductView } from '../widgets/ProductView'
// Images
import * as DeleteIcon from '/src/images/delete.png'

export const ProductsView = () => {
    
    // Define entities
    const [products, setProducts] = useState<Product[]>()

    // Load entities
    useEffect(() => { ProductAPI.findProducts().then(setProducts) }, [])

    const columns: Column<Product>[] = [
        {label: 'Preview', class: 'center', content: product => <Link to={`/products/${product.id}`}><ProductView id={product.id} mouse={false}/></Link>},
        {label: 'Name', class: 'left nowrap', content: product => <Link to={`/products/${product.id}`}>{product.name}</Link>},
        {label: 'Description', class: 'left fill', content: product => <Link to={`/products/${product.id}`}>{product.description}</Link>},
        {label: '', content: () => <img src={DeleteIcon}/>}
    ]

    return (
        <main className="view products">
            <header>
                <div>
                    <ProductsLink/>
                </div>
            </header>
            <main>
                <div>
                    <Link to={`/products/new/settings`}>
                        New product
                    </Link>
                    { products && <Table columns={columns} items={products}/> }
                </div>
            </main>
        </main>
    )

}