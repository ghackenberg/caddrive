import  * as React from 'react'
import { useState, useEffect, Fragment } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
// Commons
import { Issue, Product } from 'fhooe-audit-platform-common'
// Clients
import { IssueAPI, ProductAPI } from '../../clients/rest'
// Snippets
import { ProductHeader } from '../snippets/ProductHeader'
// Widgets
import { Column, Table } from '../widgets/Table'
import { ProductView } from '../widgets/ProductView'

export const IssuesView = (props: RouteComponentProps<{product: string}>) => {

    const productId = props.match.params.product

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [issues, setIssues] = useState<Issue[]>()

    // Load entities
    useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { IssueAPI.findIssues(productId).then(setIssues)}, [props])

    const columns: Column<Issue>[] = [
        {label: 'Label', class: 'left nowrap', content: issue => <Link to={`/products/${productId}/issues/${issue.id}`}>{issue.label}</Link>},
        {label: 'Text', class: 'left fill', content: issue => <Link to={`/products/${productId}/issues/${issue.id}`}>{issue.text}</Link>}
    ]

    return (
        <main className="view product">
            { issues && product && (
                <Fragment>
                    <ProductHeader product={product}/>
                    <main className="sidebar">
                        <div>
                            <Link to={`/products/${productId}/issues/new`}>
                                New issue
                            </Link>
                            <Table columns={columns} items={issues}/>
                        </div>
                        <div>
                            <ProductView id={productId} mouse={true}/>
                        </div>
                    </main>
                </Fragment>
            )}
        </main>
    )
}