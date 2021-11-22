import  * as React from 'react'
import { useState, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
// Commons
import { Issue, Product } from 'fhooe-audit-platform-common'
// Clients
import { IssueAPI, ProductAPI } from '../../clients/rest'
// Links
import { IssuesLink } from '../links/IssuesLink'
// Widgets
import { Column, Table } from '../widgets/Table'
import { ProductView } from '../widgets/ProductView'
// Images
import * as AuditIcon from '/src/images/audit.png'
import * as AddIcon from '/src/images/add.png'

export const IssuesView = (props: RouteComponentProps<{product: string}>) => {

    const productId = props.match.params.product

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [issues, setIssues] = useState<Issue[]>()

    // Load entities
    useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { IssueAPI.findIssues(productId).then(setIssues)}, [props])

    const columns: Column<Issue>[] = [
        {label: '', content: issue => <Link to={`/products/${productId}/issues/${issue.id}`}><img src={AuditIcon}/></Link>},
        {label: 'Label', content: issue => <Link to={`/products/${productId}/issues/${issue.id}`}>{issue.label}</Link>},
        {label: 'Text', content: issue => <Link to={`/products/${productId}/issues/${issue.id}`}>{issue.text}</Link>},
        {label: '', content: () => '', class: 'fill'}
    ]

    return (
        <div className="view sidebar product">
            { issues && product && (
                <React.Fragment>
                    <header>
                        <nav>
                            <IssuesLink product={product}/>
                        </nav>
                    </header>
                    <main>
                        <div>
                            <h1>
                                Issues
                                <Link to={`/products/${productId}/issues/new`}>
                                    <img src={AddIcon}/>
                                </Link>
                            </h1>
                            <Table columns={columns} items={issues}/>
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