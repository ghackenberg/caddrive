import { Audit } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Link } from 'react-router-dom'

export const AuditList = (props: {list: Audit[]}) => (
    <ul>
        {props.list.map(audit =>
            <li key={audit.id} style={{backgroundImage: 'url(/images/audit.png'}}>
                <Link to={`/audits/${audit.id}`}>Audit <em>{audit.id}</em></Link>
            </li>
        )}
        <li style={{backgroundImage: 'url(/images/create.png'}}>
            <Link to="/audits/new">Audit</Link>
        </li>
    </ul>
)