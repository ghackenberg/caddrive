import * as React from 'react'
import { useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
// Commons
import { Product, Version } from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI, VersionAPI } from '../../../clients/rest'
// Snippets
import { Header } from '../../snippets/Header'
import { Navigation } from '../../snippets/Navigation'
// Links
import { ProductLink } from '../../links/ProductLink'
// Searches
import { VersionSearch } from '../../searches/VersionSearch'
// Widgets
import { Column, Table } from '../../widgets/Table'
// Images
import * as VersionIcon from '/src/images/version.png'
import * as DeleteIcon from '/src/images/delete.png'

export const VersionListView = (props: RouteComponentProps<{product: string}>) => {

    const query = new URLSearchParams(props.location.search)

    const productId = query.get('product')
    
    // Define entities
    const [product, setProduct] = useState<Product>()
    const [versions, setVersions] = useState<Version[]>()

    // Load entities
    useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [])
    useEffect(() => { VersionAPI.findVersions(undefined, undefined, productId).then(setVersions) }, [])

    async function deleteVersion(version: Version) {
        setVersions(await VersionAPI.deleteVersion(version))
    }

    const columns: Column<Version>[] = [
        {label: 'Icon', content: _version => <img src={VersionIcon} style={{width: '1em'}}/>},
        {label: 'Name', content: version => <Link to={`/versions/${version.id}`}>{version.name}</Link>},
        {label: 'Date', content: version => <Link to={`/versions/${version.id}`}>{new Date(version.date).toISOString().slice(0, 10)}</Link>},
        {label: 'Delete', content: version => <a href="#" onClick={_event => deleteVersion(version)}><img src={DeleteIcon} style={{width: '1em', height: '1em'}}/></a>}
    ]

    return (
        <div className="view products">
            <Header/>
            <Navigation/>
            <main>
                { product && versions ? (
                    <React.Fragment>
                        <nav>
                            <ProductLink product={product}/>
                        </nav>
                        <h1>{product.name} (<Link to={`/products/${productId}`}>edit</Link>)</h1>
                        <h2>Versions (<Link to={`/versions/new?product=${productId}`}>+</Link>)</h2>
                        <h3>Search from</h3>
                        <VersionSearch product={productId} change={setVersions}/>
                        <h3>Search list</h3>
                        <Table columns={columns} items={versions}/>
                    </React.Fragment>
                ) : (
                    <p>Loading...</p>
                )}
            </main>
        </div>
    )

}