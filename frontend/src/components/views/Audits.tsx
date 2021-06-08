import { Audit } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { AuditAPI } from '../../api'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { AuditList } from '../widgets/AuditList'

interface State {
    audits?: Audit[]
}

export class Audits extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {}
    }
    async componentDidMount() {
        this.setState({audits: await AuditAPI.findAll()})
    }
    render() {
        return (
            <React.Fragment>
                <Header/>
                <Navigation/>
                <main>
                    <h1><Link to="/">Index</Link> &rsaquo; Audits</h1>
                    {this.state.audits ? <AuditList list={this.state.audits}/> : <p>Loading...</p>}
                </main>
            </React.Fragment>
        )
    }
}