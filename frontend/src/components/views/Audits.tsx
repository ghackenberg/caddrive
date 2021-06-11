import * as React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Audit } from 'fhooe-audit-platform-common'
import { AuditAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { AuditList } from '../widgets/AuditList'


export const Audits = () => {
    const [audits, setAudits] = useState<Audit[]>(null)
    useEffect(() => { AuditAPI.findAll().then(setAudits) }, [])
    return (
        <div className="view audits">
            <Header/>
            <Navigation/>
            <main>
                <h1><Link to="/">Index</Link> &rsaquo; Audits</h1>
                {audits ? <AuditList list={audits}/> : <p>Loading...</p>}
            </main>
        </div>
    )
}