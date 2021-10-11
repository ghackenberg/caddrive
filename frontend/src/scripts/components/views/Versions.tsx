import * as React from 'react'
import { Fragment, useState, useEffect } from 'react'
import { Product, Version } from 'fhooe-audit-platform-common'
import { Link, useLocation } from 'react-router-dom'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { VersionSearchBar } from '../widgets/SearchBar'
import { ProductAPI, VersionAPI } from '../../rest'
import { Column, Table } from '../widgets/Table'
import * as VersionIcon from '/src/images/version.png'

export const VersionsView = () => {

    const search = new URLSearchParams(useLocation().search)

    const [versions, setVersions] = useState<Version[]>([])
    const [products, setProducts] = useState<{[id: string]: Product}>({})

    useEffect(() => {
        VersionAPI.findVersions(undefined, undefined, search.get('product')).then(setVersions)
    },[])

    useEffect(() => {
        const productIds: string[] = []
        for (var index = 0; index < versions.length; index++) {
            const version = versions[index]
            if (!(version.productId in products || productIds.indexOf(version.productId) != -1)) {
                productIds.push(version.productId)
            }
        }
        for (var index = 0; index < productIds.length; index++) {
            const productId = productIds[index]
            ProductAPI.getProduct(productId).then(product => {
                const newProducts = {...products}
                newProducts[productId] = product
                setProducts(newProducts)
            })
        }
    }, [versions])

    const columns: Column<Version>[] = [
        {label: 'Icon', content: _version => <img src={VersionIcon} style={{width: '1em'}}/>},
        {label: 'Version', content: version => <b>{version.name}</b>},
        {label: 'Product', content: version => version.productId in products ? products[version.productId].name : 'Loading...'},
        {label: 'Link', content: version => <Link to={`/versions/${version.id}`}>Details</Link>},
        {label: 'Link', content: version => <Link to={`/audits/?version=${version.id}`}>Audits</Link>}
    ]

    console.log(window.location.href)

    return (
        <div className="view versions">
            <Header/>
            <Navigation/>
            <main>
                <Fragment>
                    <nav>
                        <span>
                            <Link to="/">Welcome Page</Link>
                        </span>
                        <span>
                            <a>Versions</a>
                        </span>
                    </nav>
                </Fragment>
                <h2>Available versions</h2>
                <VersionSearchBar change={setVersions} productSearch={window.location.href}/>
                {versions && <Table columns={columns} items={versions} create='Version'/>}
            </main>
        </div>
    )
}