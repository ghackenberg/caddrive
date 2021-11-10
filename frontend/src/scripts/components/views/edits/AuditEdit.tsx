import * as React from 'react'
import { useState, useEffect, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
// Commons
import { Audit, Product, Version } from 'fhooe-audit-platform-common'
// Clients
import { AuditAPI, ProductAPI, VersionAPI } from '../../../clients/rest'
// Links
import { AuditLink } from '../../links/AuditLink'
// Inputs
import { TextInput } from '../../inputs/TextInput'
import { DateInput } from '../../inputs/DateInput'

export const AuditEditView = (props: RouteComponentProps<{audit: string}>) => {

    const query = new URLSearchParams(props.location.search)

    const versionId = query.get('version')
    const auditId = props.match.params.audit

    const history = useHistory()

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [version, setVersion] = useState<Version>()
    const [audit, setAudit] = useState<Audit>()

    // Define values
    const [name, setName] = useState<string>('')
    const [start, setStart] = useState<Date>(new Date())
    const [end, setEnd] = useState<Date>(new Date())

    // Load entities
    useEffect(() => { auditId == 'new' && VersionAPI.getVersion(versionId).then(setVersion) }, [props])
    useEffect(() => { audit && VersionAPI.getVersion(audit.versionId).then(setVersion) }, [props, audit])
    useEffect(() => { version && ProductAPI.getProduct(version.productId).then(setProduct) }, [props, version])
    useEffect(() => { auditId == 'new' || AuditAPI.getAudit(auditId).then(setAudit) }, [props])

    // Load values
    useEffect(() => { audit && setName(audit.name) }, [audit])
    useEffect(() => { audit && setStart(new Date(audit.start)) }, [audit])
    useEffect(() => { audit && setEnd(new Date(audit.end)) }, [audit])


    async function submit(event: FormEvent){
        event.preventDefault()
        if (auditId == 'new') {
            if (name && start.getDate() != null && end.getDate() != null) {
                await AuditAPI.addAudit({ versionId: version.id, name, start: start.toISOString(), end: end.toISOString() })
                history.replace(`/audits?version=${version.id}`)
            }
        }
        else {
            if (name && start.getDate() != null && end.getDate() != null) {
                await AuditAPI.updateAudit(audit.id, { versionId: version.id, name, start: start.toISOString(), end: end.toISOString() })
                history.replace(`/audits?version=${version.id}`)
            }
        }
    }

    async function reset() {
        history.goBack()
    }

    return (
        <div className='view audit'>
            { (auditId == 'new' || audit) && version && product && (
                <React.Fragment>
                    <header>
                        <nav>
                            <AuditLink audit={audit} version={version} product={product}/>                           
                        </nav>
                    </header>
                    <main>
                        <div>
                            <h1>Audit editor</h1>
                            <form onSubmit={submit} onReset={reset} className='data-input'>
                                <TextInput label='Name' placeholder='Type name' value={name} change={setName}/>
                                <DateInput label='Start' placeholder='Select start' value={start} change={setStart}/>
                                <DateInput label='End' placeholder='Select end' value={end} change={setEnd}/>
                                <div>
                                    <div/>
                                    <div>
                                        { auditId == 'new' && <input type='reset' value='Cancel'/> }
                                        <input type='submit' value='Save'/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </main>
                </React.Fragment>
            )}
        </div>
    )
}