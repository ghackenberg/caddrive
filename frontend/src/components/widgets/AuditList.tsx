import { Audit } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Link } from 'react-router-dom'

export class AuditList extends React.Component<{list: Audit[]}> {
    render() {
        return (
            <ul>
                {this.props.list.map(audit =>
                    <li key={audit.id} style={{backgroundImage: 'url(/images/audit.png'}}>
                        <Link to={`/audits/${audit.id}`}>Audit <em>{audit.id}</em></Link>
                    </li>
                )}
            </ul>
        )
    }
}