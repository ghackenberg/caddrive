import * as React from 'react'
import { useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
// Commons
import { Product, Version } from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI, VersionAPI } from '../../../clients/rest'
// Links
import { ProductLink } from '../../links/ProductLink'
// Searches
import { VersionSearch } from '../../searches/VersionSearch'
// Widgets
import { Column, Table } from '../../widgets/Table'
import { ModelView } from '../../widgets/ModelView'
// Images
import * as AddIcon from '/src/images/add.png'
import * as VersionIcon from '/src/images/version.png'
import * as EditIcon from '/src/images/edit.png'
import * as DeleteIcon from '/src/images/delete.png'

export const VersionListView = (props: RouteComponentProps<{product: string}>) => {

    const query = new URLSearchParams(props.location.search)

    const productId = query.get('product')
    
    // Define entities
    const [product, setProduct] = useState<Product>()
    const [versions, setVersions] = useState<Version[]>()

    // Load entities
    useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { VersionAPI.findVersions(null, null, productId).then(setVersions) }, [props])

    async function deleteVersion(id: string) {
        await VersionAPI.deleteVersion(id)
        setVersions(versions.filter(version => version.id != id))
    }

    const columns: Column<Version>[] = [
        {label: 'Icon', content: version => <Link to={`/audits?version=${version.id}`}><img src={VersionIcon}/></Link>},
        {label: 'Model', content: version => <Link to={`/audits?version=${version.id}`}><ModelView url={`/rest/models/${version.id}`}/></Link>},
        {label: 'Name', content: version => <Link to={`/audits?version=${version.id}`}>{version.name}</Link>},
        {label: 'Date', content: version => <Link to={`/audits?version=${version.id}`}>{new Date(version.date).toISOString().slice(0, 10)}</Link>},
        {label: 'Edit', content: version => <Link to={`/versions/${version.id}`}><img src={EditIcon}/></Link>},
        {label: 'Delete', content: version => <a href="#" onClick={_event => deleteVersion(version.id)}><img src={DeleteIcon}/></a>},
        {label: '', content: () => '', class: 'fill'}
    ] 

    return (
        <div className="view products">
            { product && versions && (
                <React.Fragment>
                    <header>
                        <nav>
                            <ProductLink product={product}/>
                        </nav>
                    </header>
                    <main>
                        <div>
                            <h1>
                                Versions
                                <Link to={`/versions/new?product=${productId}`}>
                                    <img src={AddIcon}/>
                                </Link>
                            </h1>
                            <VersionSearch product={productId} change={setVersions}/>
                            <Table columns={columns} items={versions}/>
                        </div>
                    </main>
                </React.Fragment>
            )}
        </div>
    )

}