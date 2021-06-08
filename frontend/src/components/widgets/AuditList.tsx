import { Audit } from 'fhooe-audit-platform-common'
import * as React from 'react'

export class AuditList extends React.Component<{list: Audit[]}> {
    render() {
        return (
            <ul>
                {this.props.list.map(audit =>
                    <li key={audit.id}>
                        Audit {audit.id}
                    </li>
                )}
            </ul>
        )
    }
}