import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { Member, Product, User } from 'productboard-common'
// Managers
import { UserManager } from '../../managers/user'
import { ProductManager } from '../../managers/product'
import { VersionManager } from '../../managers/version'
import { IssueManager } from '../../managers/issue'
import { MemberManager } from '../../managers/member'
// Links
import { ProductsLink } from '../links/ProductsLink'
// Widgets
import { Column, Table } from '../widgets/Table'
import { ProductView3D } from '../widgets/ProductView3D'
import { ProductUserNameWidget } from '../widgets/ProductUserName'
// Images
import * as DeleteIcon from '/src/images/delete.png'
import { UserContext } from '../../contexts/User'

export const ProductView = () => {
    
    const contextUser = useContext(UserContext)

    // STATES

    // - Entities
    const [products, setProducts] = useState<Product[]>()
    const [users, setUsers] = useState<{[id: string]: User}>({})
    const [versions, setVersions] = useState<{[id: string]: number}>({})
    const [issues, setIssues] = useState<{[id: string]: number}>({})
    const [members, setMembers] = useState<{[id: string]: Member[]}>({})

    // EFFECTS

    // - Entities
    useEffect(() => { ProductManager.findProducts().then(setProducts) }, [])
    useEffect(() => {
        if (products) {
            Promise.all(products.map(product => UserManager.getUser(product.userId))).then(productUsers => {
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
            Promise.all(products.map(product => VersionManager.findVersions(product.id))).then(productVersions => {
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
            Promise.all(products.map(product => IssueManager.findIssues(product.id))).then(productIssues => {
                const newIssues = {...issues}
                for (var index = 0; index < products.length; index++) {
                    newIssues[products[index].id] = productIssues[index].length
                }
                setIssues(newIssues)
            })
        }
    }, [products])
    useEffect(() => {
        if (products) {
            Promise.all(products.map(product => MemberManager.findMembers(product.id))).then(productMembers => {
                const newMembers = {...members}
                for (var index = 0; index < products.length; index++) {
                    newMembers[products[index].id] = productMembers[index]
                }
                setMembers(newMembers)
            })
        }
    }, [products])

    // FUNCTIONS

    async function deleteProduct(product: Product) {
        if (confirm('Do you really want to delete this Product?')) {
            await ProductManager.deleteProduct(product.id)
            setProducts(products.filter(other => other.id != product.id))
        }
    }

    // CONSTANTS

    const columns: Column<Product>[] = [
        { label: 'Preview', class: 'center', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                <ProductView3D product={product} mouse={false} vr= {false}/>
            </Link>
        )},
        { label: 'Owner', class: 'left nowrap', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                {product.id in users && product.id in members ? <ProductUserNameWidget user={users[product.id]} members={members[product.id]}/> : '?'}
            </Link>
        )},
        { label: 'Name', class: 'left nowrap', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                {product.name}
            </Link>
        )},
        { label: 'Description', class: 'left fill', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                {product.description}
            </Link>
        )},
        { label: 'Versions', class: 'center', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                {product.id in versions ? versions[product.id] : '?'}
            </Link>
        )},
        { label: 'Issues', class: 'center', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                {product.id in issues ? issues[product.id] : '?'}
            </Link>
        )},
        { label: 'Members', class: 'center', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                {product.id in members ? members[product.id].length : '?'}
            </Link>
        )},
        { label: '', content: product => (
            <a onClick={() => deleteProduct(product)}>
                <img src={DeleteIcon} className='small'/>
            </a>
        )}
    ]

    // RETURN

    return (
        <main className="view products">
            <header>
                <div>
                    <ProductsLink/>
                </div>
            </header>
            <main>
                <div>
                    { contextUser.productManagementPermission && (
                        <Link to={`/products/new/settings`} className='button green fill'>
                            New product
                        </Link>
                    ) }
                    { products && <Table columns={columns} items={products}/> }
                </div>
            </main>
        </main>
    )

}