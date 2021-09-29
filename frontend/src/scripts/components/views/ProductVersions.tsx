import * as React from 'react'
import { useState, useEffect , Fragment } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Product, Version } from 'fhooe-audit-platform-common'
import { ProductAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { ProductVersionList } from '../widgets/ProductVersionList'
import { ProductLink } from '../snippets/LinkSource'

export const ProductVersionsView = (props: RouteComponentProps<{ product: string }>) => {
    
    const productId = props.match.params.product 

    const [product, setProduct] = useState<Product>(null)
    const [versions, setVersion] = useState<Version[]>(null)

    useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [])
    useEffect(() => { VersionAPI.findVersions(null, productId).then(setVersion) }, [])

    return (
        <div className="view versions">
            <Header/>
            <Navigation/>
            <main>
                <Fragment>
                    <nav>
                        <ProductLink product={product}/>
                        <span>
                            <Link to={`/products/${productId}/version`}>Versions</Link>
                        </span>
                    </nav>
                </Fragment>
                <h2>Available versions</h2>
                {product && versions ? <ProductVersionList product={product} list={versions}/> : <p>Loading...</p>}
            </main>
        </div>
    )
}