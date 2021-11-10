import  * as React from 'react'
import { useState, useEffect } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
// Commons
import { Audit, CommentEvent, Event, Product, User, Version} from 'fhooe-audit-platform-common'
// Clients
import { AuditAPI, EventAPI, ProductAPI, UserAPI, VersionAPI } from '../../../clients/rest'
// Links
import { AuditLink } from '../../links/AuditLink'
// Searches
import { EventSearch } from '../../searches/EventSearch'
// Widgets
import { Column, Table } from '../../widgets/Table'
import { ModelView } from '../../widgets/ModelView'
// Images
import * as EnterIcon from '/src/images/enter.png'
import * as EventIcon from '/src/images/event.png'

export const EventListView = (props: RouteComponentProps<{audit: string}>) => {

    const query = new URLSearchParams(props.location.search)

    const auditId = query.get('audit')

    // Define entities
    const [product, setProduct] = useState<Product>()
    const [version, setVersion] = useState<Version>()
    const [audit, setAudit] = useState<Audit>()
    const [events, setEvents] = useState<Event[]>()
    const [users, setUsers] = useState<{[id: string]: User}>({})

    // Load entities
    useEffect(() => { AuditAPI.getAudit(auditId).then(setAudit) }, [props])
    useEffect(() => { audit && VersionAPI.getVersion(audit.versionId).then(setVersion) }, [audit])
    useEffect(() => { version && ProductAPI.getProduct(version.productId).then(setProduct) }, [version])
    useEffect(() => { EventAPI.findEvents(null, null, null, null, null, null, auditId).then(setEvents) }, [props])
    useEffect(() => {
        if (events) {
            const load: string[] = []
            events.forEach(event => {
                if (!(event.userId in users)) {
                    load.push(event.userId)
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

    const columns: Column<Event>[] = [
        {label: 'Icon', content: _event => <a><img src={EventIcon}/></a>},
        {label: 'User', content: event => event.userId in users ? <span>{users[event.userId].name} &lt;{users[event.userId].email}&gt;</span> : <p>Loading...</p>},
        {label: 'Type', content: event => event.type},
        {label: 'Time', content: event => new Date(event.time).toISOString()},
        {label: 'Text', content: event => event.type == 'comment' ? (event as CommentEvent).text : ''}
    ]

    return (
        <div className='view sidebar audit'>
            { events && audit && version && product && (
                <React.Fragment>
                    <header>
                        <nav>
                            <AuditLink audit={audit} version={version} product={product}/>                      
                        </nav>
                    </header>
                    <main>
                        <div>
                            <h1>
                                Events
                                <Link to={`/audits/${auditId}/join`}>
                                    <img src={EnterIcon}/>
                                </Link>
                            </h1>
                            <EventSearch audit={auditId} change={setEvents}/>
                            <Table columns={columns} items={events.map(event => event).reverse()}/> 
                        </div>
                        <div>
                            <ModelView url={`/rest/models/${version.id}`}/>
                        </div>
                    </main>
                </React.Fragment>
            )}
        </div>
    )
}