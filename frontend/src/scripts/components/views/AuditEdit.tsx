import * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Audit, Product, Version, EventData, CommentEvent, User } from 'fhooe-audit-platform-common/src/data'
import { AuditAPI, EventAPI, ProductAPI, UserAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { DateInput, TextInput } from '../snippets/Inputs'
import { AuditLink } from '../snippets/Links'
import { Column, Table } from '../widgets/Table'
import * as EventIcon from '../../../images/event.png'
import * as DeleteIcon from '../../../images/delete.png'

export const AuditEditView = (props: RouteComponentProps<{audit: string}>) => {

    const query = new URLSearchParams(props.location.search)

    const versionId = query.get('version')
    const auditId = props.match.params.audit

    const history = useHistory()

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [version, setVersion] = useState<Version>()
    const [audit, setAudit] = useState<Audit>()
    const [events, setEvents] = useState<(EventData & {id: string})[]>()
    const [users, setUsers] = useState<{[id: string]: User}>({})

    // Define values
    const [name, setName] = useState<string>()
    const [start, setStart] = useState<Date>()
    const [end, setEnd] = useState<Date>()

    // Load entities
    useEffect(() => { version && ProductAPI.getProduct(version.productId).then(setProduct) }, [version])
    useEffect(() => { (versionId || audit) && VersionAPI.getVersion(versionId || audit.versionId).then(setVersion) }, [props, audit])
    useEffect(() => { auditId == 'new' || AuditAPI.getAudit(auditId).then(setAudit) }, [props])
    useEffect(() => { auditId == 'new' || EventAPI.findEvents(undefined, auditId).then(setEvents) }, [props])
    useEffect(() => {
        if (events) {
            const load: string[] = []
            events.forEach(event => {
                if (!(event.user in users)) {
                    load.push(event.user)
                }
            })
            load.forEach(userId => {
                UserAPI.getUser(userId).then(user => {
                    const dict = {...users}
                    dict[userId] = user
                    setUsers(dict)
                })
            })
        }
    }, [props, events])

    async function submit(event: FormEvent){
        event.preventDefault()
        if (auditId == 'new') {
            if (name && start.getDate() != null && end.getDate() != null) {
                const audit = await AuditAPI.addAudit({ versionId, name, start, end})
                history.replace(`/audits/${audit.id}`)
            }
        }
        else {
            if (name && start.getDate() != null && end.getDate() != null) {
                setAudit(await AuditAPI.updateAudit({id: audit.id, versionId: audit.versionId, name, start, end}))
            }
        }
    }

    async function reset() {
        history.goBack()
    }

    const columns: Column<EventData & {id: string}>[] = [
        {label: 'Icon', content: _event => <img src={EventIcon} style={{width: '1em'}}/>},
        {label: 'User', content: event => event.user in users ? <span>{users[event.user].name} &lt;{users[event.user].email}&gt;</span> : <p>Loading...</p>},
        {label: 'Type', content: event => event.type},
        {label: 'Time', content: event => event.time.toString()},
        {label: 'Text', content: event => event.type == 'comment' ? (event as CommentEvent).text : ''},
        {label: 'Delete', content: _event => <a href="#" onClick={_event => {}}><img src={DeleteIcon} style={{width: '1em', height: '1em'}}/></a>}
    ]

    return (
        <div className='view audit'>
            <Header/>
            <Navigation/>
            <main>
                { (auditId == 'new' || audit) && version && product ? (
                    <Fragment>
                        <nav>
                            <AuditLink audit={audit} version={version} product={product}/>                           
                        </nav>
                        <h1>Audit editor</h1>
                        <form onSubmit={submit} onReset={reset} className='user-input'>
                            <TextInput  
                                label='Audit name' 
                                placeholder='Add new audit'
                                value={auditId != 'new' ? audit.name : ''} 
                                change={value => setName(value)}
                                disabled={auditId != 'new'}/>
                            <DateInput  
                                label='Start time'
                                placeholder='Select start date'
                                change={date => setStart(date)}
                                selected={auditId != 'new' ? new Date(audit.start) : start}
                                disabled={auditId != 'new'}/>
                            <DateInput
                                label='End time'
                                placeholder='Select end date'
                                change={date => setEnd(date)}
                                selected={auditId != 'new' ? new Date(audit.end) : end}
                                disabled={auditId != 'new'}/>
                            <div>
                                <div/>
                                <div>
                                    <input type='reset' value='Cancel'/>
                                    <input type='submit' value="Save" className='saveItem'/>
                                </div>
                            </div>
                        </form>
                        {auditId != 'new' && (
                            <Fragment>
                                <h2>Event list (<Link to={`/audits/${auditId}/join`}>Join</Link>)</h2>
                                { events && <Table columns={columns} items={events}/> }
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