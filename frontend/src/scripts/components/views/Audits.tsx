import { Audit } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Fragment, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuditAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { AuditList } from '../widgets/AuditList'
import { AuditSearchBar } from '../widgets/SearchBar'


export const AuditsView = () =>  {

    const [audits, setAudits] = useState<Audit[]>()

    useEffect(() => { AuditAPI.findAudits().then(setAudits) }, [])

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
                <AuditSearchBar change={setAudits}/>
                {audits ? <AuditList auditList={audits}/> : <p>Loading...</p>}
            </main>
        </div>
    )
} 