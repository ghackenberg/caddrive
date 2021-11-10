import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { Product } from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI } from '../../../clients/rest'
// Links
import { ProductsLink } from '../../links/ProductsLink'
// Searches
import { ProductSearch } from '../../searches/ProductSearch'
// Widgets
import { Column, Table } from '../../widgets/Table'
import { ProductView } from '../../widgets/ProductView'
// Images
import * as AddIcon from '/src/images/add.png'
import * as ProductIcon from '/src/images/product.png'
import * as EditIcon from '/src/images/edit.png'
import * as DeleteIcon from '/src/images/delete.png'

export const ProductListView = () => {
    
    // Define entities
    const [products, setProducts] = useState<Product[]>()

    // Load entities
    useEffect(() => { ProductAPI.findProducts().then(setProducts) }, [])

    async function deleteProduct(id: string) {
        await ProductAPI.deleteProduct(id)
        setProducts(products.filter(product => product.id != id))
    }

    const columns: Column<Product>[] = [
        {label: '', content: product => <Link to={`/versions?product=${product.id}`}><img src={ProductIcon}/></Link>},
        {label: 'Model', content: product => <Link to={`/versions?product=${product.id}`}><ProductView id={product.id} mouse={false}/></Link>},
        {label: 'Product', content: product => <Link to={`/versions?product=${product.id}`}>{product.name}</Link>},
        {label: '', content: product => <Link to={`/products/${product.id}`}><img src={EditIcon}/></Link>},
        {label: '', content: product => <a href="#" onClick={_event => deleteProduct(product.id)}><img src={DeleteIcon}/></a>},
        {label: '', content: () => '', class: 'fill'}
    ]

    return (
        <div className="view products">
            <header>
                <nav>
                    <ProductsLink/>
                </nav>
            </header>
            <main>
                <div>
                    <h1>
                        Products
                        <Link to={`/products/new`}>
                            <img src={AddIcon}/>
                        </Link>
                    </h1>
                    <ProductSearch change={setProducts}/>
                    { products && <Table columns={columns} items={products}/> }
                </div>
            </main>
        </div>
    )

}