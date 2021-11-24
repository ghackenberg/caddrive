import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { Product, User } from 'fhooe-audit-platform-common'
// Clients
import { IssueAPI, ProductAPI, UserAPI, VersionAPI } from '../../clients/rest'
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
    const [users, setUsers] = useState<{[id: string]: User}>({})
    const [versions, setVersions] = useState<{[id: string]: number}>({})
    const [issues, setIssues] = useState<{[id: string]: number}>({})

    // Load entities
    useEffect(() => { ProductAPI.findProducts().then(setProducts) }, [])
    useEffect(() => {
        if (products) {
            Promise.all(products.map(product => UserAPI.getUser(product.userId))).then(productUsers => {
                const newUsers = {...users}
                for (var index = 0; index < products.length; index++) {
                    newUsers[products[index].id] = productUsers[index]
                }
                setUsers(newUsers)
            })
        }
    }, [products])
    useEffect(() => {
        if (products) {
            Promise.all(products.map(product => VersionAPI.findVersions(product.id))).then(productVersions => {
                const newVersions = {...versions}
                for (var index = 0; index < products.length; index++) {
                    newVersions[products[index].id] = productVersions[index].length
                }
                setVersions(newVersions)
            })
        }
    }, [products])
    useEffect(() => {
        if (products) {
            Promise.all(products.map(product => IssueAPI.findIssues(product.id))).then(productIssues => {
                const newIssues = {...issues}
                for (var index = 0; index < products.length; index++) {
                    newIssues[products[index].id] = productIssues[index].length
                }
                setIssues(newIssues)
            })
        }
    }, [products])

    const columns: Column<Product>[] = [
        {label: 'Preview', class: 'center', content: product => <Link to={`/products/${product.id}`}><ProductView product={product} mouse={false}/></Link>},
        {label: 'User', class: 'left nowrap', content: product => <Link to={`/products/${product.id}`}>{product.id in users ? users[product.id].name : '?'}</Link>},
        {label: 'Name', class: 'left nowrap', content: product => <Link to={`/products/${product.id}`}>{product.name}</Link>},
        {label: 'Description', class: 'left fill', content: product => <Link to={`/products/${product.id}`}>{product.description}</Link>},
        {label: 'Versions', class: 'center', content: product => <Link to={`/products/${product.id}`}>{product.id in versions ? versions[product.id] : '?'}</Link>},
        {label: 'Issues', class: 'center', content: product => <Link to={`/products/${product.id}`}>{product.id in issues ? issues[product.id] : '?'}</Link>},
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