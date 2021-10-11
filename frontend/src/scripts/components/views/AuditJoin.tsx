import * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
import { Audit, Version, Product, CommentEvent, EventData } from 'fhooe-audit-platform-common/src/data'
import { AuditAPI, EventAPI, ProductAPI, VersionAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { TextInput } from '../snippets/Inputs'
import { AuditLink } from '../snippets/Links'
import { UserContext } from '../../context'
import * as AuditIcon from '/src/images/audit.png'

export const AuditJoinView = (props: RouteComponentProps<{product: string, version: string, audit: string}>) => {

    const productId = props.match.params.product
    const versionId = props.match.params.version
    const auditId = props.match.params.audit

    const history = useHistory()

    const user = React.useContext(UserContext)

    const [audit, setAudit] = useState<Audit>(null)
    const [version, setVersion] = useState<Version>(null)
    const [product, setProduct] = useState<Product>(null)
    const [events, setEvents] = useState<(EventData & {id: string})[]>(null)
    const [comment, setComment] = useState<string>(null)

    // Load entities
    useEffect(() => { ProductAPI.getProduct(productId).then(setProduct) }, [props])
    useEffect(() => { VersionAPI.getVersion(versionId).then(setVersion) }, [props])
    useEffect(() => { AuditAPI.getAudit(auditId).then(setAudit) }, [props])
    useEffect(() => { EventAPI.findEvents(undefined, auditId, 'comment').then(setEvents) }, [props])
    // Post events
    useEffect(() => {
        EventAPI.enterEvent({ auditId: auditId, user: user.id, time: new Date(), type: 'enter' })
        return () => {
            EventAPI.leaveEvent({ auditId: auditId, user: user.id, time: new Date(), type: 'leave' })      // TODO: enter & leave event fired 2 times!!
        }
    }, [props])

    async function submitAudit(event: FormEvent) {
        event.preventDefault()
        if (comment) {
            await EventAPI.submitEvent({ time: new Date(), auditId: auditId, user: user.id, type: 'comment', text: comment})
            await EventAPI.findEvents(undefined, auditId, 'comment').then(setEvents)
        }
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
                { product && version && audit && events ? (
                    <Fragment>
                        <nav>
                            <AuditLink product={product} version={version} audit={audit}/>
                        </nav>
                        <h1>Audit editor</h1>
                        <form onSubmit={submitAudit} onReset={leaveAudit} className='user-input'>
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
