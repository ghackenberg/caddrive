import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { Product } from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI } from '../../../clients/rest'
// Snippets
import { Header } from '../../snippets/Header'
import { Navigation } from '../../snippets/Navigation'
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
        {label: 'Icon', content: _product => <img src={ProductIcon} style={{width: '1em'}}/>},
        {label: 'Model', content: product => <ProductView id={product.id}/>},
        {label: 'Product', content: product => <Link to={`/versions?product=${product.id}`}>{product.name}</Link>},
        {label: 'Edit', content: product => <Link to={`/products/${product.id}`}><img src={EditIcon} style={{width: '1em', height: '1em'}}/></Link>},
        {label: 'Delete', content: product => <a href="#" onClick={_event => deleteProduct(product.id)}><img src={DeleteIcon} style={{width: '1em', height: '1em'}}/></a>}
    ]

    return (
        <div className="view products">
            <Header/>
            <Navigation/>
            <main>
                <div>
                    <nav>
                        <ProductsLink/>
                    </nav>
                    <h1>Products <Link to={`/products/new`}><img src={AddIcon} style={{width: '1em', height: '1em', margin: '0.25em'}}/></Link></h1>                
                    <h2>Search list</h2>
                    <ProductSearch change={setProducts}/>
                    { products && <Table columns={columns} items={products}/> }
                </div>
            </main>
        </div>
    )

}