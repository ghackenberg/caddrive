import { Audit } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Link } from 'react-router-dom'
import * as AuditIcon from '/src/images/audit.png'
import * as CreateIcon from '/src/images/create.png'

export const AuditList = (props: {auditList: Audit[]}) => (
    <div className="widget audit_list">
        <ul>
            {props.auditList.map(audit =>
                <li key={audit.id}>
                    <Link to={`/audits/${audit.id}`}><img src={AuditIcon}/>Audit <em>{audit.name}</em></Link>
                </li>
            )}
            <li>
                <Link to={"/audits/new"}><img src={CreateIcon}/>Audit</Link>
            </li>
        </ul>
    </div>
)