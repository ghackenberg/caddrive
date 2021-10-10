import * as React from 'react'
import { useState, useEffect, Fragment } from 'react'
import { Audit, CommentEventData, Product, Version } from 'fhooe-audit-platform-common'
import * as EventIcon from '/src/images/click.png'
import { Link, useLocation } from 'react-router-dom'
import { AuditAPI, EventAPI, ProductAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { Column, Table } from '../widgets/Table'
import { EventSearchBar } from '../widgets/SearchBar'

export const EventsView = () => {

    const search = new URLSearchParams(useLocation().search)

    const [events, setEvents] = useState<CommentEventData[]>()
    const [audits, setAudits] = useState<{[id: string]: Audit}>({})
    const [products, setProducts] = useState<{[id: string]: Product}>({})
    const [versions, setVersions] = useState<{[id: string]: Version}>({})

    useEffect(() => {
        EventAPI.findEvents(undefined, search.get('audit'),undefined, undefined, search.get('product'), search.get('version'), undefined).then(async events => {
            setEvents(events)
            const newAudits = {...audits}

            for (var index = 0; index < events.length; index++) {
                const event = events[index]
                if (!(event.auditId in newAudits)) {
                    newAudits[event.auditId] = await AuditAPI.getAudit(event.auditId)
                }
            }

            setAudits(newAudits)

            const newVersions = {...versions}

            for (var auditId in newAudits) {
                const audit = newAudits[auditId]
                if(!(audit.versionId in newVersions)) {
                    newVersions[audit.versionId] = await VersionAPI.getVersion(audit.versionId)
                }
            }

            setVersions(newVersions)

            const newProducts = {...products}

            for (var versionId in newVersions) {
                const version = newVersions[versionId]
                if(!(version.productId in newProducts)) {
                    newProducts[version.productId] = await ProductAPI.getProduct(version.productId)
                }
            }
            setProducts(newProducts)
        }) 
    }, [])

    const columns: Column<CommentEventData>[] = [
        {label: 'Icon', content: _event => <img src={EventIcon} style={{width: '1em'}}/>},
        {label: 'Event type', content: event => <b>{event.type}</b>},
        {label: 'Audit', content: event => event.auditId in audits ? audits[event.auditId].name : 'Loading...'},
        {label: 'User', content: event => event.user},
        {label: 'Product', content: event => event.auditId in audits && audits[event.auditId].versionId in versions && versions[audits[event.auditId].versionId].productId in products ? products[versions[audits[event.auditId].versionId].productId].name : 'Loading...'},
        {label: 'Version', content: event => event.auditId in audits && audits[event.auditId].versionId in versions ? versions[audits[event.auditId].versionId].name : 'Loading...'},
        {label: 'Comment', content: event => event.text},
        {label: 'Time', content: event => event.time}
    ]

    return (
        <div className="view events">
        <Header/>
        <Navigation/>
        <main>
            <Fragment>
                <nav>
                    <span>
                        <Link to="/">Welcome Page</Link> 
                    </span>
                    <span>
                        <a>Events</a>
                    </span>
                </nav>
            </Fragment>
            <h2>Available events</h2>
            <EventSearchBar change={setEvents}/>
            {events && <Table columns={columns} items={events}/>}
        </main>
    </div> 
    )
}