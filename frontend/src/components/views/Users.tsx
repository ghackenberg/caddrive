import { User } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { UserAPI } from '../../api'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { UserList } from '../widgets/UserList'

interface State {
    users?: User[]
}

export class Users extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props)
        this.state = {}
    }
    async componentDidMount() {
        this.setState({users: await UserAPI.findAll()})
    }
    render() {
        return (
            <React.Fragment>
                <Header/>
                <Navigation/>
                <main>
                    <h1>Users</h1>
                    {this.state.users ? <UserList list={this.state.users}/> : <p>Loading...</p>}
                </main>
            </React.Fragment>
        )
    }
}