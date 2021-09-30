import * as React from 'react'
import { Fragment, useState, useEffect } from 'react'
import { Product, Version } from 'fhooe-audit-platform-common'
import { Link } from 'react-router-dom'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { VersionSearchBar } from '../widgets/SearchBar'
import { ProductAPI, VersionAPI } from '../../rest'
import { Column, Table } from '../widgets/Table'
import * as VersionIcon from '/src/images/version.png'

export const VersionsView = () => {

    const [versions, setVersions] = useState<Version[]>()
    const [products, setProducts] = useState<{[id: string]: Product}>({})

    useEffect(() => {
        VersionAPI.findVersions().then(async versions => {
            setVersions(versions)
            const newProducts = {...products}
            for (var index = 0; index < versions.length; index++) {
                const version = versions[index]
                if (!(version.productId in newProducts)) {
                    newProducts[version.productId] = await ProductAPI.getProduct(version.productId)
                }
            }
            setProducts(newProducts)
        })
    }, [])

    const columns: Column<Version>[] = [
        {label: 'Icon', content: _version => <img src={VersionIcon} style={{width: '1em'}}/>},
        {label: 'Version', content: version => <b>{version.name}</b>},
        {label: 'Product', content: version => version.productId in products ? products[version.productId].name : 'Loading...'},
        {label: 'Link', content: version => <Link to={`/versions/${version.id}`}>Details</Link>},
        {label: 'Link', content: version => <Link to={`/audits/?version=${version.id}`}>Audits</Link>}
    ]

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
                <VersionSearchBar change={setVersions}/>
                {versions && <Table columns={columns} items={versions} create='Version'/>}
            </main>
        </div>
    )
}