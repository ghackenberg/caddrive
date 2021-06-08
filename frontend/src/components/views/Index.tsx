import { Audit, Product, User } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { AuditAPI, ProductAPI, UserAPI } from '../../api'
import { Header } from '../snippets/Header'
import { AuditList } from '../widgets/AuditList'
import { ProductList } from '../widgets/ProductList'
import { UserList } from '../widgets/UserList'

interface State {
    users?: User[]
    products?: Product[]
    audits?: Audit[]
}

export class Index extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {}
    }
    async componentDidMount() {
        this.setState({users: await UserAPI.findAll()})
        this.setState({products: await ProductAPI.findAll()})
        this.setState({audits: await AuditAPI.findAll()})
    }
    render() {
        return (
            <React.Fragment>
                <Header/>
                <main style={{padding: '1em', paddingTop: '3em'}}>
                    <Link to="/demo">Demo</Link>
                    {this.state.users ? <UserList list={this.state.users}/> : <p>Loading users</p>}
                    {this.state.products ? <ProductList list={this.state.products}/> : <p>Loading products</p>}
                    {this.state.audits ? <AuditList list={this.state.audits}/> : <p>Loading audits</p>}
                </main>
            </React.Fragment>
        )
    }
}