import  * as React from 'react'
import { useState, useEffect, Fragment } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
// Commons
import { Audit, Product, Version} from 'fhooe-audit-platform-common'
// Clients
import { AuditAPI, ProductAPI, VersionAPI } from '../../../clients/rest'
// Snippets
import { Header } from '../../snippets/Header'
import { Navigation } from '../../snippets/Navigation'
// Links
import { VersionLink } from '../../links/VersionLink'
// Searches
import { AuditSearch } from '../../searches/AuditSearch'
// Widgets
import { Column, Table } from '../../widgets/Table'
// Images
import * as AuditIcon from '/src/images/audit.png'
import * as AddIcon from '/src/images/add.png'
import * as EditIcon from '/src/images/edit.png'
import * as DeleteIcon from '/src/images/delete.png'

export const AuditListView = (props: RouteComponentProps<{version: string}>) => {

    const query = new URLSearchParams(props.location.search)

    const versionId = query.get('version')

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [version, setVersion] = useState<Version>()
    const [audits, setAudits] = useState<Audit[]>()

    // Load entities
    useEffect(() => { VersionAPI.getVersion(versionId).then(setVersion) }, [props])
    useEffect(() => { version && ProductAPI.getProduct(version.productId).then(setProduct) }, [props, version])
    useEffect(() => { version && AuditAPI.findAudits(undefined, undefined, undefined, version.id).then(setAudits)}, [props,version])

    async function deleteAudit(auditId: string) {
        setAudits(await AuditAPI.deleteAudit(auditId))
    }

    const columns: Column<Audit>[] = [
        {label: 'Icon', content: _audit => <img src={AuditIcon} style={{width: '1em'}}/>},
        {label: 'Name', content: audit => <Link to={`/events?audit=${audit.id}`}>{audit.name}</Link>},
        {label: 'Start', content: audit => <Link to={`/audits/${audit.id}`}>{new Date(audit.start).toISOString().slice(0, 10)}</Link>},
        {label: 'End', content: audit => <Link to={`/audits/${audit.id}`}>{new Date(audit.end).toISOString().slice(0, 10)}</Link>},
        {label: 'Edit', content: audit => <Link to={`/audits/${audit.id}`}><img src={EditIcon} style={{width: '1em', height: '1em'}}/></Link>},
        {label: 'Delete', content: audit => <a href="#" onClick={_event => deleteAudit(audit.id)}><img src={DeleteIcon} style={{width: '1em', height: '1em'}}/></a>}
    ]

    return (
        <div className="view version">
            <Header/>
            <Navigation/>
            <main>
                { audits && version && product? (
                    <Fragment>
                        <nav>
                            <VersionLink version={version} product={product}/>
                        </nav>
                        <h1>{version.name} <Link to={`/versions/${versionId}`}><img src={EditIcon} style={{width: '1em', height: '1em', margin: '0.2em'}}/></Link></h1>
                        <h2>Audits <Link to={`/audits/new?version=${versionId}`}><img src={AddIcon} style={{width: '1em', height: '1em', margin: '0.25em'}}/></Link></h2>
                        <h3>Search list</h3>
                        <AuditSearch version={versionId} change={setAudits}/>
                        <Table columns={columns} items={audits}/>
                    </Fragment>
                ) : (
                    <p>Loading...</p>
                )}
            </main>
        </div>
    )
}