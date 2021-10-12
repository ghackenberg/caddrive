import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
// Commons
import { Audit, Product, Version} from 'fhooe-audit-platform-common'
// Clients
import { AuditAPI, ProductAPI, VersionAPI } from '../../clients/rest'
// Snippets
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
// Links
import { VersionLink } from '../links/VersionLink'
// Inputs
import { TextInput } from '../inputs/TextInput'
import { DateInput } from '../inputs/DateInput'
// Widgets
import { Column, Table } from '../widgets/Table'
// Images
import * as AuditIcon from '../../../images/audit.png'
import * as DeleteIcon from '../../../images/delete.png'
import { AuditSearch } from '../searches/AuditSearch'

export const VersionEditView = (props: RouteComponentProps<{ version: string }>) => {

    const query = new URLSearchParams(props.location.search)

    const productId = query.get('product')
    const versionId = props.match.params.version
        
    const history = useHistory()

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [version, setVersion] = useState<Version>()
    const [audits, setAudits] = useState<Audit[]>()

    // Define values
    const [name, setName] = useState<string>('')
    const [date, setDate] = useState<Date>(new Date())

    // Load entities
    useEffect(() => { (productId || version) && ProductAPI.getProduct(productId || version.productId).then(setProduct) }, [props, version])
    useEffect(() => { versionId == 'new' || VersionAPI.getVersion(versionId).then(setVersion) }, [props])
    useEffect(() => { versionId == 'new' || AuditAPI.findAudits(undefined, undefined, undefined, versionId).then(setAudits) }, [props])

    // Load values
    useEffect(() => { version && setName(version.name) }, [version])
    useEffect(() => { version && setDate(new Date(version.date)) }, [version])

    async function submit(event: FormEvent){
        event.preventDefault()
        if (versionId == 'new') {
            if (name && date) {
                const version = await VersionAPI.addVersion({ productId, name, date: date.toString() })
                history.replace(`/versions/${version.id}`)
            }
        } else {
            if (name && date) {
                // TODO update version
            }
        }
    }

    async function reset(_event: React.FormEvent) {
        history.goBack()
    }

    const columns: Column<Audit>[] = [
        {label: 'Icon', content: _audit => <img src={AuditIcon} style={{width: '1em'}}/>},
        {label: 'Name', content: audit => <Link to={`/audits/${audit.id}`}>{audit.name}</Link>},
        {label: 'Start', content: audit => <Link to={`/audits/${audit.id}`}>{audit.start}</Link>},
        {label: 'End', content: audit => <Link to={`/audits/${audit.id}`}>{audit.end}</Link>},
        {label: 'Delete', content: _audit => <a href="#" onClick={_event => {}}><img src={DeleteIcon} style={{width: '1em', height: '1em'}}/></a>}
    ]
        
    return (
        <div className="view version">
            <Header/>
            <Navigation/>
            <main>
                { (versionId == 'new' || version) && product ? (
                    <Fragment>
                        <nav>
                            <VersionLink version={version} product={product}/>
                        </nav>
                        <h1>Version editor</h1>
                        <h2>Property form</h2>
                        <form onSubmit={submit} onReset={reset}>                     
                            <TextInput label='Name' placeholder='Type name' value={name} change={setName}/>
                            <DateInput label='Date' placeholder='Select date' value={date} change={setDate}/>
                            <div>
                                <div/>
                                <div>
                                    { versionId == 'new' && <input type='reset' value='Cancel'/> }
                                    <input type='submit' value='Save'/>
                                </div>
                            </div>
                        </form>
                        {versionId != 'new' && (
                            <Fragment>
                                <h2>Audit list (<Link to={`/audits/new?version=${versionId}`}>+</Link>)</h2>
                                <AuditSearch version={versionId} change={setAudits}/>
                                { audits && <Table columns={columns} items={audits}/> }
                            </Fragment>
                        )}
                    </Fragment>
                ) : (
                    <p>Loading...</p>
                )}
            </main>
        </div>
    )

}