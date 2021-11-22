import  * as React from 'react'
import { useState, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
// Commons
import { Issue, Product } from 'fhooe-audit-platform-common'
// Clients
import { IssueAPI, ProductAPI } from '../../../clients/rest'
// Links
import { ProductLink } from '../../links/ProductLink'
// Widgets
import { Column, Table } from '../../widgets/Table'
import { ProductView } from '../../widgets/ProductView'
// Images
import * as AuditIcon from '/src/images/audit.png'
import * as AddIcon from '/src/images/add.png'
import * as EditIcon from '/src/images/edit.png'
import * as DeleteIcon from '/src/images/delete.png'

export const IssueListView = (props: RouteComponentProps<{product: string}>) => {

    const query = new URLSearchParams(props.location.search)

    const productId = query.get('product')

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [issues, setIssues] = useState<Issue[]>()

    // Load entities
    useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { IssueAPI.findIssues(productId).then(setIssues)}, [props])

    async function deleteIssue(id: string) {
        await IssueAPI.deleteIssue(id)
        setIssues(issues.filter(issue => issue.id != id))
    }

    const columns: Column<Issue>[] = [
        {label: '', content: issue => <Link to={`/comments?issue=${issue.id}`}><img src={AuditIcon}/></Link>},
        {label: 'Label', content: issue => <Link to={`/comments?issue=${issue.id}`}>{issue.label}</Link>},
        {label: 'Text', content: issue => <Link to={`/comments?issue=${issue.id}`}>{issue.text}</Link>},
        {label: '', content: issue => <Link to={`/issues/${issue.id}`}><img src={EditIcon}/></Link>},
        {label: '', content: issue => <a href="#" onClick={_event => deleteIssue(issue.id)}><img src={DeleteIcon}/></a>},
        {label: '', content: () => '', class: 'fill'}
    ]

    return (
        <div className="view sidebar product">
            { issues && product && (
                <React.Fragment>
                    <header>
                        <nav>
                            <ProductLink product={product}/>
                        </nav>
                    </header>
                    <main>
                        <div>
                            <h1>
                                Issues
                                <Link to={`/issues/new?product=${productId}`}>
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