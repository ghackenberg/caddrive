import * as React from 'react'
import { useState, useEffect, useContext, FormEvent } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom'
// Commons
import { Audit, Version, Product, Event, CommentEvent } from 'fhooe-audit-platform-common'
// Clients
import { AuditAPI, EventAPI, ProductAPI, VersionAPI } from '../../../clients/rest'
// Contexts
import { UserContext } from '../../../contexts/User'
// Links
import { EventLink } from '../../links/EventLink'
// Inputs
import { TextInput } from '../../inputs/TextInput'
// Widgets
import { ModelView } from '../../widgets/ModelView'

export const EventEditView = (props: RouteComponentProps<{event: string}>) => {

    const query = new URLSearchParams(props.location.search)

    const auditId = query.get('audit')
    const eventId = props.match.params.event

    const history = useHistory()

    const user = useContext(UserContext)

    // Define entities
    const [event, setEvent] = useState<Event>()
    const [audit, setAudit] = useState<Audit>()
    const [version, setVersion] = useState<Version>()
    const [product, setProduct] = useState<Product>()

    // Define values
    const [text, setText] = useState<string>('')

    // Load entities
    useEffect(() => { eventId != 'new' && EventAPI.getEvent(eventId).then(setEvent) }, [props])
    useEffect(() => { eventId == 'new' && AuditAPI.getAudit(auditId).then(setAudit) }, [props])
    useEffect(() => { event && AuditAPI.getAudit(event.auditId).then(setAudit) }, [event])
    useEffect(() => { audit && VersionAPI.getVersion(audit.versionId).then(setVersion) }, [audit])
    useEffect(() => { version && ProductAPI.getProduct(version.productId).then(setProduct) }, [version])

    // Load values
    useEffect(() => { event && event.type == 'comment' && setText((event as CommentEvent).text) }, [event])

    // Post events
    async function submit(event: FormEvent) {
        event.preventDefault()
        if (eventId == 'new') {
            if (text) {
                await EventAPI.addCommentEvent({ auditId: audit.id, userId: user.id, time: new Date().toISOString(), type: 'comment', text })
                history.replace(`/events?audit=${audit.id}`)
            }
        }
        else {
            if (text) {
                // TODO: await EventAPI.updateEvent(event.id, { auditId: audit.id, userId: user.id, time: new Date().toISOString(), type: 'comment', text })
                history.replace(`/events?audit=${audit.id}`)
            }
        }
    }

    async function reset(_event: FormEvent) {
        history.goBack()
    }

    return (
        <div className='view sidebar audit'>
            { product && version && audit && (
                <React.Fragment>
                    <header>
                        <nav>
                            <EventLink product={product} version={version} audit={audit} event={event}/>
                        </nav>
                    </header>
                    <main>
                        <div>
                            <h1>
                                Comment editor
                            </h1>
                            <form onSubmit={submit} onReset={reset} className='data-input'>
                                <TextInput label='Text' placeholder={'Type text'} value={text} change={setText}/>
                                <div>
                                    <div/>
                                    <div>
                                        <input type='submit' value='Submit'/>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div>
                            <ModelView url={`/rest/models/${version.id}`} mouse={true}/>
                        </div>
                    </main>
                </React.Fragment>
            )}
        </div>
    )
    
}
