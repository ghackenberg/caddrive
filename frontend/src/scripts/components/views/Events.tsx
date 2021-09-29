import * as React from 'react'
import { useState, useEffect, Fragment } from 'react'
import { CommentEventData } from 'fhooe-audit-platform-common'
import * as EventIcon from '/src/images/click.png'
import { Link } from 'react-router-dom'
import { EventAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { Column, Table } from '../widgets/Table'

export const EventsView = () => {

    const [events, setEvents] = useState<CommentEventData[]>(null)

    const columns: Column<CommentEventData>[] = [
        {label: 'Icon', content: _event => <img src={EventIcon} style={{width: '1em'}}/>},
        {label: 'Event type', content: event => <b>{event.type}</b>},
        {label: 'Audit', content: event => event.auditId},
        {label: 'User', content: event => event.user},
        {label: 'Time', content: event => event.time},
        {label: 'Text', content: event => event.text}
        //{label: 'Link', content: event => <Link to={`/users/${user.id}`}>Details</Link>}
    ]

    useEffect(() => {EventAPI.findEvents().then(setEvents) }, [])

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
            {events && <Table columns={columns} items={events}/>}
            {/*<SearchBarList type='users'/>*/}
        </main>
    </div> 
    )
}