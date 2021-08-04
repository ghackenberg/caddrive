import { Audit } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Link } from 'react-router-dom'
import * as AuditIcon from '/assets/images/audit.png'
import * as CreateIcon from '/assets/images/create.png'

export const AuditList = (props: {list: Audit[]}) => (
    <div className="widget audit_list">
        <ul>
            {props.list.map(audit =>
                <li key={audit.id}>
                    <Link to={`/audits/${audit.id}`}><img src={AuditIcon}/>Audit <em>{audit.id}</em></Link>
                </li>
            )}
            <li>
                <Link to="/audits/new"><img src={CreateIcon}/>Audit</Link>
            </li>
        </ul>
    </div>
)