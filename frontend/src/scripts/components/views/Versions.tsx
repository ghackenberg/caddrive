import * as React from 'react'
import { useState, useEffect } from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
// Commons
import { Product, Version } from 'fhooe-audit-platform-common'
// Clients
import { ProductAPI, VersionAPI } from '../../clients/rest'
// Links
import { VersionsLink } from '../links/VersionsLink'
// Widgets
import { Column, Table } from '../widgets/Table'
import { ModelView } from '../widgets/ModelView'
import { ProductView } from '../widgets/ProductView'
// Images
import * as AddIcon from '/src/images/add.png'
import * as VersionIcon from '/src/images/version.png'

export const VersionsView = (props: RouteComponentProps<{product: string}>) => {

    const productId = props.match.params.product
    
    // Define entities
    const [product, setProduct] = useState<Product>()
    const [versions, setVersions] = useState<Version[]>()

    // Load entities
    useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { VersionAPI.findVersions(productId).then(setVersions) }, [props])

    const columns: Column<Version>[] = [
        {label: '', content: version => <Link to={`/products/${productId}/versions/${version.id}`}><img src={VersionIcon}/></Link>},
        {label: 'Model', content: version => <Link to={`/products/${productId}/versions/${version.id}`}><ModelView url={`/rest/models/${version.id}`} mouse={false}/></Link>},
        {label: 'Number', content: version => <Link to={`/products/${productId}/versions/${version.id}`}>{version.major}.{version.minor}.{version.patch}</Link>},
        {label: '', content: () => '', class: 'fill'}
    ] 

    return (
        <div className="view sidebar products">
            { product && versions && (
                <React.Fragment>
                    <header>
                        <nav>
                            <VersionsLink product={product}/>
                        </nav>
                    </header>
                    <main>
                        <div>
                            <h1>
                                Versions
                                <Link to={`/products/${productId}/versions/new`}>
                                    <img src={AddIcon}/>
                                </Link>
                            </h1>
                            <Table columns={columns} items={versions}/>
                        </div>
                        <div>
                            <ProductView id={productId} mouse={true}/>
                        </div>
                    </main>
                </React.Fragment>
            )}
        </div>
    )

}