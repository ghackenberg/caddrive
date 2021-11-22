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
// Widgets
import { Column, Table } from '../../widgets/Table'
import { ModelView } from '../../widgets/ModelView'
import { ProductView } from '../../widgets/ProductView'
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
    useEffect(() => { VersionAPI.findVersions(productId).then(setVersions) }, [props])

    async function deleteVersion(id: string) {
        await VersionAPI.deleteVersion(id)
        setVersions(versions.filter(version => version.id != id))
    }

    const columns: Column<Version>[] = [
        {label: '', content: _version => <a><img src={VersionIcon}/></a>},
        {label: 'Model', content: version => <a><ModelView url={`/rest/models/${version.id}`} mouse={false}/></a>},
        {label: 'Number', content: version => <a>{version.major}.{version.minor}.{version.patch}</a>},
        {label: '', content: version => <Link to={`/versions/${version.id}`}><img src={EditIcon}/></Link>},
        {label: '', content: version => <a href="#" onClick={_event => deleteVersion(version.id)}><img src={DeleteIcon}/></a>},
        {label: '', content: () => '', class: 'fill'}
    ] 

    return (
        <div className="view sidebar products">
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