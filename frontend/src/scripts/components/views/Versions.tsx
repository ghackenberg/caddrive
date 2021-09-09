import * as React from 'react'
import { useState, useEffect , Fragment } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Product, Version } from 'fhooe-audit-platform-common'
import { ProductAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { VersionList } from '../widgets/VersionList'
import { LinkSource } from '../widgets/LinkSource'

export const VersionsView = (props: RouteComponentProps<{ product: string }>) => {
    
    const productId = props.match.params.product 

    const [product, setProduct] = useState<Product>(null)
    const [versions, setVersion] = useState<Version[]>(null)

    useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [])
    useEffect(() => { VersionAPI.findVersions(productId).then(setVersion) }, [])

    return (
        <div className="view versions">
            <Header/>
            <Navigation/>
            <main>
                <Fragment>
                    <nav>
                        <LinkSource object={product} id={product.id} name={product.name} type='Product'/>  
                        <span>
                            <Link to={`/products/${productId}/version`}>Versions</Link>
                        </span>
                    </nav>
                </Fragment>
                <h2>Available versions</h2>
                {product && versions ? <VersionList product={product} list={versions}/> : <p>Loading...</p>}
            </main>
        </div>
    )
}