import * as React from 'react'
import { useRef, useState, useEffect, Fragment, FormEvent } from 'react'
import { Link, RouteComponentProps, useHistory } from 'react-router-dom'
import { Audit, EventData } from '../../data'
import { AuditAPI, MemoAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { LinkSource } from '../widgets/LinkSource'
import * as AuditIcon from '/src/images/audit.png'

export const MemoView = (props: RouteComponentProps<{audit: string}>) => {

    const auditId = props.match.params.audit

    const memoInput = useRef<HTMLInputElement>(null)

    const history = useHistory()

    const [audit, setAudit] = useState<Audit>(null)
    const [memos, setMemos] = useState<EventData[]>(null)

    useEffect(() => {
        MemoAPI.enterMemo({ audit: auditId, user: 'null', time: new Date(), type: 'enter' })
        return () => {
            MemoAPI.leaveMemo({ audit: auditId, user: 'null', time: new Date(), type: 'leave' })
        }
    })
    useEffect(() => { MemoAPI.findAll(auditId).then(setMemos) }, [])

    if (auditId != 'new') {
        useEffect(() => { AuditAPI.getAudit(auditId).then(setAudit) }, [])
    }

    async function submitAudit(event: FormEvent) {
        event.preventDefault()

        if (memoInput.current.value != '') {
            await MemoAPI.submitMemo({  time: new Date(),       // TODO: Hot reload, Fill up and refresh memos array
                audit: auditId,
                user: 'null',
                type: 'comment',
                text: memoInput.current.value})
        }

        history.goBack()
    }

    async function leaveAudit(event: FormEvent) {
        event.preventDefault()

        await MemoAPI.leaveMemo({   time: new Date(),       // TODO: change user & type
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
                        <LinkSource object={audit} id={audit.id} name={audit.name} type='Audit'/> 
                        <span>
                            <Link to={`/audits/${audit.id}/memo`}>Memos</Link>
                        </span>
                    </nav>
                <h1>{ 'Available memos' }</h1>
                <form onSubmit={submitAudit} onReset={leaveAudit} className='user-input'>
                    <div>
                        <label>TODO: Add POST-IT's</label>
                    </div>
                    <div className="widget memo_list">
                        <ul>
                            { memos.map(memo =>
                            <li key={memo.audit}>
                                <a><img src={AuditIcon}/><em>{memo.type}</em></a>
                            </li>)}
                        </ul>
                    </div>
                    <div>
                        <div>
                            <input ref={memoInput} placeholder={'Type in new comment'}/>
                        </div>
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