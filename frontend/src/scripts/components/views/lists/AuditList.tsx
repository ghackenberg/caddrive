import  * as React from 'react'
import { useState, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
// Commons
import { Audit, Product, Version} from 'fhooe-audit-platform-common'
// Clients
import { AuditAPI, ProductAPI, VersionAPI } from '../../../clients/rest'
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
import { ModelView } from '../../widgets/ModelView'

export const AuditListView = (props: RouteComponentProps<{version: string}>) => {

    const query = new URLSearchParams(props.location.search)

    const versionId = query.get('version')

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [version, setVersion] = useState<Version>()
    const [audits, setAudits] = useState<Audit[]>()

    // Load entities
    useEffect(() => { VersionAPI.getVersion(versionId).then(setVersion) }, [props])
    useEffect(() => { version && ProductAPI.getProduct(version.productId).then(setProduct) }, [version])
    useEffect(() => { AuditAPI.findAudits(null, null, null, versionId).then(setAudits)}, [props])

    async function deleteAudit(id: string) {
        await AuditAPI.deleteAudit(id)
        setAudits(audits.filter(audit => audit.id != id))
    }

    const columns: Column<Audit>[] = [
        {label: 'Icon', content: audit => <Link to={`/events?audit=${audit.id}`}><img src={AuditIcon}/></Link>},
        {label: 'Name', content: audit => <Link to={`/events?audit=${audit.id}`}>{audit.name}</Link>},
        {label: 'Start', content: audit => <Link to={`/events?audit=${audit.id}`}>{new Date(audit.start).toISOString().slice(0, 10)}</Link>},
        {label: 'End', content: audit => <Link to={`/events?audit=${audit.id}`}>{new Date(audit.end).toISOString().slice(0, 10)}</Link>},
        {label: 'Edit', content: audit => <Link to={`/audits/${audit.id}`}><img src={EditIcon}/></Link>},
        {label: 'Delete', content: audit => <a href="#" onClick={_event => deleteAudit(audit.id)}><img src={DeleteIcon}/></a>}
    ]

    return (
        <div className="view sidebar version">
            { audits && version && product && (
                <React.Fragment>
                    <header>
                        <nav>
                            <VersionLink version={version} product={product}/>
                        </nav>
                    </header>
                    <main>
                        <div>
                            <h1>
                                Audits
                                <Link to={`/audits/new?version=${versionId}`}>
                                    <img src={AddIcon}/>
                                </Link>
                            </h1>
                            <AuditSearch version={versionId} change={setAudits}/>
                            <Table columns={columns} items={audits}/>
                        </div>
                        <div>
                            <ModelView url={`/rest/models/${versionId}`}/>
                        </div>
                    </main>
                </React.Fragment>
            )}
        </div>
    )
}