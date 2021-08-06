import * as React from 'react'
// import { useRef } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
import { AuditAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export const Audit = (props: RouteComponentProps<{id: string}>) => {

    const history = useHistory()

    async function saveAudit(){
        if (props.match.params.id == 'new')
            await AuditAPI.addAudit({id: 'test'})
        else
            await AuditAPI.updateAudit({id: props.match.params.id})

        history.goBack()
    }

    return (
        <div className="view audit">
            <Header/>
            <Navigation/>
            <main>
                <h1><Link to="/">Welcome Page</Link> &rsaquo; <Link to="/audits">Audits</Link> &rsaquo; {props.match.params.id}</h1>
                <button onClick={saveAudit}>Save</button>
            </main>
        </div>
    )
}