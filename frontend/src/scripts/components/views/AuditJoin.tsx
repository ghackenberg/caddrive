import * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
// Commons
import { Audit, Version, Product, CommentEvent, EventData } from 'fhooe-audit-platform-common'
// Clients
import { AuditAPI, EventAPI, ProductAPI, VersionAPI } from '../../clients/rest'
// Contexts
import { UserContext } from '../../contexts/User'
// Snippets
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
// Links
import { AuditLink } from '../links/AuditLink'
// Inputs
import { TextInput } from '../inputs/TextInput'
// Images
import * as AuditIcon from '/src/images/audit.png'

export const AuditJoinView = (props: RouteComponentProps<{audit: string}>) => {

    const auditId = props.match.params.audit

    const history = useHistory()

    const user = React.useContext(UserContext)

    // Define entities
    const [audit, setAudit] = useState<Audit>()
    const [version, setVersion] = useState<Version>()
    const [product, setProduct] = useState<Product>()
    const [events, setEvents] = useState<(EventData & {id: string})[]>()

    // Define values
    const [comment, setComment] = useState<string>()

    // Load entities
    useEffect(() => { version && ProductAPI.getProduct(version.productId).then(setProduct) }, [version])
    useEffect(() => { audit && VersionAPI.getVersion(audit.versionId).then(setVersion) }, [audit])
    useEffect(() => { AuditAPI.getAudit(auditId).then(setAudit) }, [props])
    useEffect(() => { EventAPI.findEvents(undefined, auditId, 'comment').then(setEvents) }, [props])

    // Post events
    useEffect(() => {
        EventAPI.enterEvent({ auditId: auditId, user: user.id, time: new Date(), type: 'enter' })
        return () => {
            // TODO: enter & leave event fired 2 times!!
            EventAPI.leaveEvent({ auditId: auditId, user: user.id, time: new Date(), type: 'leave' }) 
        }
    }, [props])

    async function submit(event: FormEvent) {
        event.preventDefault()
        if (comment) {
            await EventAPI.submitEvent({ time: new Date(), auditId: auditId, user: user.id, type: 'comment', text: comment})
            await EventAPI.findEvents(undefined, auditId, 'comment').then(setEvents)
        }
    }

    async function reset(_event: FormEvent) {
        history.goBack()
    }

    return (
        <div className='view audit'>
            <Header/>
            <Navigation/>
            <main>
                { product && version && audit && events ? (
                    <Fragment>
                        <nav>
                            <AuditLink product={product} version={version} audit={audit}/>
                        </nav>
                        <h1>Audit editor</h1>
                        <form onSubmit={submit} onReset={reset} className='user-input'>
                            {events ? 
                            <div className="widget audit_list">
                                <ul>
                                    { events.map(event =>
                                    <li key={event.id}>
                                        <a><img src={AuditIcon}/><em>{(event as CommentEvent).text}</em></a>
                                    </li>)}
                                </ul>
                            </div> : <p>Loading...</p>}
                            <TextInput  
                                    label='Comment'
                                    placeholder={'Add here new comment'}
                                    value={''}
                                    change={setComment}/>
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
