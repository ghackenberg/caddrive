import * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
// Commons
import { Audit, Product, Version, EventData, CommentEvent, User } from 'fhooe-audit-platform-common'
// Clients
import { AuditAPI, EventAPI, ProductAPI, UserAPI, VersionAPI } from '../../../clients/rest'
// Snippets
import { Header } from '../../snippets/Header'
import { Navigation } from '../../snippets/Navigation'
// Links
import { AuditLink } from '../../links/AuditLink'
// Searches
import { EventSearch } from '../../searches/EventSearch'
// Inputs
import { TextInput } from '../../inputs/TextInput'
import { DateInput } from '../../inputs/DateInput'
// Widgets
import { Column, Table } from '../../widgets/Table'
// Images
import * as EventIcon from '/src/images/event.png'
import * as DeleteIcon from '/src/images/delete.png'

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
    const [name, setName] = useState<string>('')
    const [start, setStart] = useState<Date>(new Date())
    const [end, setEnd] = useState<Date>(new Date())

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

    // Load values
    useEffect(() => { audit && setName(audit.name) }, [audit])
    useEffect(() => { audit && setStart(new Date(audit.start)) }, [audit])
    useEffect(() => { audit && setEnd(new Date(audit.end)) }, [audit])

    async function deleteEvent(event: EventData & {id: string}) {
        setEvents(await EventAPI.deleteEvent(event))
    }

    async function submit(event: FormEvent){
        event.preventDefault()
        if (auditId == 'new') {
            if (name && start.getDate() != null && end.getDate() != null) {
                const audit = await AuditAPI.addAudit({ versionId, name, start: start.toString(), end: end.toString()})
                history.replace(`/audits/${audit.id}`)
            }
        }
        else {
            if (name && start.getDate() != null && end.getDate() != null) {
                setAudit(await AuditAPI.updateAudit({id: audit.id, versionId: audit.versionId, name, start: start.toString(), end: end.toString()}))
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
        {label: 'Time', content: event => new Date(event.time).toISOString()},
        {label: 'Text', content: event => event.type == 'comment' ? (event as CommentEvent).text : ''},
        {label: 'Delete', content: event => <a href="#" onClick={_event => deleteEvent(event)}><img src={DeleteIcon} style={{width: '1em', height: '1em'}}/></a>}
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
                        <h2>Audit action</h2>
                        <p>
                            <Link to={`/audits/${auditId}/join`}>Enter</Link>
                        </p>
                        <h2>Property form</h2>
                        <form onSubmit={submit} onReset={reset}>
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
                        {auditId != 'new' && (
                            <Fragment>
                                <h2>Event list</h2>
                                <h3>Search from</h3>
                                <EventSearch audit={auditId} change={setEvents}/>
                                <h3>Search list</h3>
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