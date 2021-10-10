import * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { Link, RouteComponentProps, useHistory } from 'react-router-dom'
import { Audit, CommentEventData } from 'fhooe-audit-platform-common/src/data'
import { AuditAPI, EventAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import * as AuditIcon from '/src/images/audit.png'
import { TextInput } from '../snippets/InputForms'
import { AuditLink } from '../snippets/LinkSource'

export const AuditView = (props: RouteComponentProps<{audit: string}>) => {

    const auditId = props.match.params.audit

    const history = useHistory()

    const [audit, setAudit] = useState<Audit>(null)
    const [events, setEvents] = useState<CommentEventData[]>(null)
    const [comment, setComment] = useState<string>(null)

    if (auditId != 'new') {
        useEffect(() => { AuditAPI.getAudit(auditId).then(setAudit) }, [])

        useEffect(() => {
            EventAPI.enterEvent({ auditId: auditId, user: 'null', time: new Date(), type: 'enter' })

            return () => {
                EventAPI.leaveEvent({ auditId: auditId, user: 'null', time: new Date(), type: 'leave' })      // TODO: enter & leave event fired 2 times!!
            }
        }, [])
    }

    useEffect(() => { EventAPI.findEvents(undefined, auditId, 'comment').then(setEvents) }, [])

    async function submitAudit(event: FormEvent) {
        event.preventDefault()

        if (comment) {
            await EventAPI.submitEvent({  
                time: new Date(),       
                auditId: auditId,
                user: 'null',
                type: 'comment',
                text: comment})
        }

        await EventAPI.findEvents(undefined, auditId, 'comment').then(setEvents)
    }

    async function leaveAudit(event: FormEvent) {
        event.preventDefault()

        history.push('/audits')
    }

    return (
        <div className='view memo'>
            <Header/>
            <Navigation/>
            <main>
                { auditId == 'new' || (audit && events) ? (
                <Fragment>
                    <nav>
                        <AuditLink audit={audit}/>
                        <span>
                            <Link to={`/audits/${audit.id}/event`}>Comments</Link>
                        </span>
                    </nav>
                <h1>{ 'Available comments' }</h1>
                <form onSubmit={submitAudit} onReset={leaveAudit} className='user-input'>
                    {events ? 
                    <div className="widget memo_list">
                        <ul>
                            { events.map(event =>
                            <li key={event.auditId}>
                                <a><img src={AuditIcon}/><em>{event.text}</em></a>
                            </li>)}
                        </ul>
                    </div> : <p>Loading...</p>}
                    <TextInput  
                            label='Comment'
                            placeholder={'Add here new comment'}
                            value={''}
                            change={value => setComment(value)}/>
                    <div>
                        <div/>
                        <div>
                            <input type='reset' value='Leave audit'/>
                            <input type='submit' value='Submit audit' className='saveItem'/>
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