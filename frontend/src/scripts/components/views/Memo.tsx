import * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { Link, RouteComponentProps, useHistory } from 'react-router-dom'
import { Audit } from '../../data'
import { AuditAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { LinkSource } from '../widgets/LinkSource'

export const MemoView = (props: RouteComponentProps<{audit: string}>) => {

    const auditId = props.match.params.audit

    const [audit, setAudit] = useState<Audit>(null)

    if (auditId != 'new') {
        useEffect(() => { AuditAPI.getAudit(auditId).then(setAudit) }, [])
    }

const history = useHistory()

async function submitAudit(event: FormEvent) {
    event.preventDefault()

    // TODO: add API call for CommentEvent
}

async function leaveAudit(event: FormEvent) {
    event.preventDefault()

    history.goBack()
}

    return (
        <div className='view audit'>
            <Header/>
            <Navigation/>
            <main>
                { auditId == 'new' || audit ? (
                    <Fragment>
                        <nav>
                            <LinkSource object={audit} id={audit.id} name={audit.name} type='Audit'/> 
                            <span>
                                <Link to={`/audits/${audit.id}/memo`}>Memos</Link>
                            </span>
                        </nav>
                    <h1>{ 'Available memos' }</h1>
                    <form onSubmit={submitAudit} onReset={leaveAudit}>
                        <div>
                            <label>TODO: Add POST-IT's</label>
                        </div>
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