import * as React from 'react'
import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'

import { Issue, Product, Version } from 'productboard-common'

import { VersionAPI } from '../../clients/mqtt/version'
import { UserContext } from '../../contexts/User'
import { VersionContext } from '../../contexts/Version'
import { useProducts } from '../../hooks/route'
import { IssueManager } from '../../managers/issue'
import { ProductManager } from '../../managers/product'
import { VersionManager } from '../../managers/version'
import { LegalFooter } from '../snippets/LegalFooter'
import { Column, Table } from '../widgets/Table'
import { ProductUserPictureWidget } from '../widgets/ProductUserPicture'
import { MemberCount } from '../counts/Members'
import { LoadingView } from './Loading'

import DeleteIcon from '/src/images/delete.png'
import LoadIcon from '/src/images/load.png'
import EmptyIcon from '/src/images/empty.png'

export const ProductView = () => {
    
    // CONTEXTS
    
    const { contextUser } = useContext(UserContext)
    const { setContextVersion } = useContext(VersionContext)

    // HOOKS

    const { products } = useProducts()

    // INITIAL STATES
    
    const initialVersions: {[productId: string]: Version[]} = {}
    for (const product of products || []) {
        const versions = VersionManager.findVersionsFromCache(product.id)
        if (versions) {
            initialVersions[product.id] = versions
        }
    }
    const initialLatestVersions: {[productId: string]: Version} = {}
    for (const product of products || []) {
        const versions = VersionManager.findVersionsFromCache(product.id)
        if (versions && versions.length > 0) {
            initialLatestVersions[product.id] = versions[versions.length - 1]
        }
    }
    const initialIssues: {[productId: string]: Issue[]} = {}
    for (const product of products || []) {
        const issues = IssueManager.findIssuesFromCache(product.id, undefined, undefined)
        if (issues) {
            initialIssues[product.id] = issues
        }
    }
    
    // STATES

    // - Entities
    const [versions, setVersions] = useState<{[productId: string]: Version[]}>(initialVersions)
    const [latestVersions, setLatestVersions] = useState<{[productId: string]: Version}>(initialLatestVersions)
    const [issues, setIssues] = useState<{[productId: string]: Issue[]}>(initialIssues)

    // EFFECTS

    // - Entities
    useEffect(() => { setContextVersion(undefined) })

    useEffect(() => {
        let exec = true
        if (products) {
            Promise.all(products.map(product => VersionManager.findVersions(product.id))).then(productVersions => {
                if (exec) {
                    const newVersions = {...versions}
                    for (let index = 0; index < products.length; index++) {
                        newVersions[products[index].id] = productVersions[index]
                    }
                    setVersions(newVersions)
                }
            })
        }
        return () => { exec = false }
    }, [products])
    useEffect(() => {
        if (versions) {
            const latestVersions: {[productId: string]: Version} = {}
            for (const productId of Object.keys(versions)) {
                if (versions[productId].length > 0) {
                    latestVersions[productId] = versions[productId][versions[productId].length - 1]
                } else {
                    latestVersions[productId] = null
                }
            }
            setLatestVersions(latestVersions)
        }
    }, [versions])
    useEffect(() => {
        let exec = true
        if (products) {
            Promise.all(products.map(product => IssueManager.findIssues(product.id))).then(productIssues => {
                if (exec) {
                    const newIssues = {...issues}
                    for (let index = 0; index < products.length; index++) {
                        newIssues[products[index].id] = productIssues[index]
                    }
                    setIssues(newIssues)
                }
            })
        }
        return () => { exec = false }
    }, [products])

    // - Events
    useEffect(() => {
        return VersionAPI.register({
            create(version) {
                const newVersions: {[productId: string]: Version[]} = {}
                for (const productId of Object.keys(versions)) {
                    if (version.productId == productId) {
                        newVersions[productId] = [ ...versions[productId].filter(other => other.id != version.id), version ]
                    } else {
                        newVersions[productId] = versions[productId]
                    }
                }
                setVersions(newVersions)
            },
            update(version) {
                const newVersions: {[productId: string]: Version[]} = {}
                for (const productId of Object.keys(versions)) {
                    if (version.productId == productId) {
                        newVersions[productId] = versions[productId].map(other => other.id != version.id ? other : version)
                    } else {
                        newVersions[productId] = versions[productId]
                    }
                }
                setVersions(newVersions)
            },
            delete(version) {
                const newVersions: {[productId: string]: Version[]} = {}
                for (const productId of Object.keys(versions)) {
                    if (version.productId == productId) {
                        newVersions[productId] = versions[productId].filter(other => other.id != version.id)
                    } else {
                        newVersions[productId] = versions[productId]
                    }
                }
                setVersions(newVersions)
            },
        })
    })

    // FUNCTIONS

    async function deleteProduct(product: Product) {
        // TODO handle unmount!
        if (confirm('Do you really want to delete this Product?')) {
            await ProductManager.deleteProduct(product.id)
        }
    }

    // CONSTANTS
    
    const columns: Column<Product>[] = [
        { label: '📷', class: 'center', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                {product.id in latestVersions ? (
                    latestVersions[product.id] ? (
                        latestVersions[product.id].imageType ? (
                            <div style={ { backgroundImage: `url("/rest/files/${latestVersions[product.id].id}.${latestVersions[product.id].imageType}")` } } className="model"/>
                        ) : (
                            <div className="model">
                                <img src={LoadIcon} className='icon small position center animation spin'/>
                            </div>
                        )
                    ) : (
                        <div className="model" >
                            <img src={EmptyIcon} className='icon medium position center'/>
                        </div>
                    )
                ) : (
                    <div className="model" >
                        <img src={LoadIcon} className='icon small position center animation spin'/>
                    </div>
                )}
            </Link>
        ) },
        { label: 'Name', class: 'left nowrap', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                {product.name}
            </Link>
        ) },
        { label: 'Description', class: 'left fill', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                {product.description}
            </Link>
        ) },
        { label: 'Versions', class: 'center', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                {product.id in versions ? versions[product.id].length : '?'}
            </Link>
        ) },
        { label: 'Issues', class: 'center', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                {product.id in issues ? issues[product.id].length : '?'}
            </Link>
        ) },
        { label: 'Members', class: 'center', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                <MemberCount productId={product.id}/>
            </Link>
        ) },
        { label: '👤', class: 'center', content: product => (
            <Link to={`/products/${product.id}/versions`}>
                <ProductUserPictureWidget userId={product.userId} productId={product.id} class='icon medium round'/>
            </Link>
        ) },
        { label: '🛠️', content: product => (
            <a onClick={() => deleteProduct(product)}>
                <img src={DeleteIcon} className='icon medium pad'/>
            </a>
        ) }
    ]

    // RETURN

    return (
        products ? (
            <main className="view product">
                <div>
                    <div>
                        {contextUser ? (
                            <Link to='/products/new/settings' className='button fill green'>
                                New product
                            </Link>
                        ) : (
                            <a className='button fill green' style={{fontStyle: 'italic'}}>
                                New product (requires login)
                            </a>
                        )}
                        {products && (
                            <Table columns={columns} items={products.map(p => p).reverse()}/>
                        )}
                    </div>
                    <LegalFooter/>
                </div>
            </main>
        ) : (
            <LoadingView/>
        )
    )

}