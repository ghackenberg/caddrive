import * as React from 'react'
import { useRef, useState, useEffect, Fragment } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
import { AuditData } from '../../data'
import { AuditAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export const Audit = (props: RouteComponentProps<{id: string}>) => {

    const id = props.match.params.id

    const [audit, setAudit] = useState<AuditData>(null)

    if (id != 'new') {
        useEffect(() => { AuditAPI.getAudit(id).then(setAudit) }, [])
    }

    const auditInput = useRef<HTMLInputElement>(null)
    const auditStartInput = useRef<HTMLInputElement>(null)
    const auditEndInput = useRef<HTMLInputElement>(null)
    const history = useHistory()

    async function saveAudit(){
        if (id == 'new') {
            if (auditInput.current.value != '' && auditStartInput.current.value != '' && auditEndInput.current.value != '') {
                await AuditAPI.addAudit({name: auditInput.current.value, start: auditStartInput.current.value, end: auditEndInput.current.value})

                history.goBack()
            }
        }
        else {
            if (auditInput.current.value != '' && auditStartInput.current.value != '' && auditEndInput.current.value != '') {
                await AuditAPI.updateAudit({id: id, name: auditInput.current.value, start: auditStartInput.current.value, end: auditEndInput.current.value})

                history.goBack()
            }
        }
    }

    async function cancelInput() {
        history.goBack()
    }

    return (
        <div className="view audit">
            <Header/>
            <Navigation/>
            <main>
                <h1><Link to="/">Welcome Page</Link> &rsaquo; <Link to="/audits">Audits</Link> &rsaquo; {id}</h1>
                {id == 'new' ? (<h2>Add new Audit</h2>) : (<h2>Change existing Audit</h2>)}
                {id == 'new' || audit != null ? (
                    <Fragment>
                        <label>
                            Audit:<br></br>
                            <input ref={auditInput} placeholder={ id=='new' ? "Add here new product" : audit.name }></input><br></br>
                            <br></br>
                            Start time:<br></br>
                            <input ref={auditStartInput} placeholder={ id=='new' ? "Please enter Audit start time" : String(audit.start) }></input><br></br>
                            <br></br>
                            End time:<br></br>
                            <input ref={auditEndInput} placeholder={ id=='new' ? "Please enter Audit end time" : String(audit.end) }></input><br></br>
                        </label>
                        <button onClick={cancelInput}>Cancel</button>
                        <button onClick={saveAudit}>Save</button>
                    </Fragment>
                    ) : (
                        <p>Loading...</p>
                    )}
            </main>
        </div>
    )
}