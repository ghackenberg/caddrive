import * as React from 'react'
import { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Audit } from 'fhooe-audit-platform-common'
import { AuditAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { AuditList } from '../widgets/AuditList'


export const AuditsView = () =>  {

    const [audits, setAudit] = useState<Audit[]>(null)

    useEffect(() => { AuditAPI.findAll().then(setAudit) }, [])

    return (
        <div className="view audits">
            <Header/>
            <Navigation/>
            <main>
                <Fragment>
                    <nav>
                        <span>
                            <Link to="/">Welcome Page</Link> 
                        </span>
                        <span>
                            <a>Audits</a>
                        </span>
                    </nav>
                </Fragment>
                <h2>Available audits</h2>
                {audits ? <AuditList auditList={audits}/> : <p>Loading...</p>}
            </main>
        </div>
    )
}