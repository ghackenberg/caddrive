import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Audit, Product, Version} from 'fhooe-audit-platform-common'
import { AuditAPI, ProductAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { DateInput, TextInput } from '../snippets/Inputs'
import { VersionLink } from '../snippets/Links'
import { Column, Table } from '../widgets/Table'
import * as AuditIcon from '../../../images/audit.png'
import * as DeleteIcon from '../../../images/delete.png'

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
    const [name, setName] = useState<string>()
    const [date, setDate] = useState<Date>()

    // Load entities
    useEffect(() => { (productId || version) && ProductAPI.getProduct(productId || version.productId).then(setProduct) }, [props, version])
    useEffect(() => { versionId == 'new' || VersionAPI.getVersion(versionId).then(setVersion) }, [props])
    useEffect(() => { versionId == 'new' || AuditAPI.findAudits(undefined, undefined, undefined, versionId).then(setAudits) }, [props])

    async function submit(event: FormEvent){
        event.preventDefault()
        if (versionId == 'new') {
            if (name && date) {
                const version = await VersionAPI.addVersion({ productId, name, date })
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
                        <form onSubmit={submit} onReset={reset} className='user-input'>                     
                            <TextInput 
                                label='Version name'
                                placeholder='Add here new version'
                                value={version ? version.name : ''}
                                change={value => setName(value)}
                                disabled={versionId != 'new'}/>
                            <DateInput
                                label='Version date'
                                placeholder='Select version date'
                                change={date => setDate(date)}
                                selected ={versionId != 'new' ? new Date(version.date) : date}
                                disabled={versionId != 'new'}/>
                            <div>
                                <div/>
                                <div>
                                    { versionId == 'new' && <input type="reset" value="Cancel"/> }
                                    <input type="submit" value="Save"/>
                                </div>
                            </div>
                        </form>
                        {versionId != 'new' && (
                            <Fragment>
                                <h2>Audit list (<Link to={`/audits/new?version=${versionId}`}>+</Link>)</h2>
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