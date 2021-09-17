import * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { Link, RouteComponentProps, useHistory } from 'react-router-dom'
import { Audit, CommentEventData } from 'fhooe-audit-platform-common/src/data'
import { AuditAPI, EventAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import * as AuditIcon from '/src/images/audit.png'
import { TextInput } from './forms/InputForms'
import { AuditLink } from './forms/AuditLink'

export const EventView = (props: RouteComponentProps<{audit: string}>) => {

    const auditId = props.match.params.audit

    const history = useHistory()

    const [audit, setAudit] = useState<Audit>(null)
    const [events, setEvents] = useState<CommentEventData[]>(null)
    const [comment, setComment] = useState<string>(null)

    if (auditId != 'new') {
        useEffect(() => { AuditAPI.getAudit(auditId).then(setAudit) }, [])

        useEffect(() => {
            EventAPI.enterEvent({ audit: auditId, user: 'null', time: new Date(), type: 'enter' })

            return () => {
                EventAPI.leaveEvent({ audit: auditId, user: 'null', time: new Date(), type: 'leave' })      // TODO: enter & leave event fired 2 times!!
            }
        }, [])
    }

    useEffect(() => { EventAPI.findComments(auditId).then(setEvents) }, [])

    async function submitAudit(event: FormEvent) {
        event.preventDefault()

        window.location.reload()

        if (comment != '') {
            await EventAPI.submitEvent({  
                time: new Date(),       
                audit: auditId,
                user: 'null',
                type: 'comment',
                text: comment})
        }

        useEffect(() => { EventAPI.findComments(auditId).then(setEvents) }, [])
    }

    async function leaveAudit(event: FormEvent) {
        event.preventDefault()

        await EventAPI.leaveEvent({ time: new Date(),       // TODO: change user & type
                                    audit: auditId,
                                    user: 'null',
                                    type: 'leaveAudit'})
        history.goBack()
    }

    return (
        <div className='view memo'>
            <Header/>
            <Navigation/>
            <main>
                { auditId == 'new' || audit ? (
                <Fragment>
                    <nav>
                        <AuditLink audit={audit}/>
                        <span>
                            <Link to={`/audits/${audit.id}/event`}>Comments</Link>
                        </span>
                    </nav>
                <h1>{ 'Available comments' }</h1>
                <form onSubmit={submitAudit} onReset={leaveAudit} className='user-input'>
                    <div>
                        <label>TODO: Add POST-IT's</label>
                    </div>
                    <div className="widget memo_list">
                        <ul>
                            { events.map(event =>
                            <li key={event.audit}>
                                <a><img src={AuditIcon}/><em>{event.text}</em></a>
                            </li>)}
                        </ul>
                    </div>
                    <TextInput  
                            label='Comment:'
                            placeholder={'Add here new comment'}
                            change={value => setComment(value)}/>
                    <div>
                        <div/>
                        <div>
                            <input type='reset' value='Leave audit'/>
                            <input type='submit' value='Submit audit'/>
                        </div>
                    </div>
                </form>
                </Fragment>
                ) : (
                    <p>Loading...</p>
                )}
            </main>
        </div>
    )
}