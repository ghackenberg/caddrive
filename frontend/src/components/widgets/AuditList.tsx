import { Audit } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Link } from 'react-router-dom'

export const AuditList = (props: {list: Audit[]}) => (
    <div className="widget audit_list">
        <ul>
            {props.list.map(audit =>
                <li key={audit.id}>
                    <Link to={`/audits/${audit.id}`}><img src="/images/audit.png"/>Audit <em>{audit.id}</em></Link>
                </li>
            )}
            <li>
                <Link to="/audits/new"><img src="/images/create.png"/>Audit</Link>
            </li>
        </ul>
    </div>
)