import * as React from 'react'
import { Route, Switch } from 'react-router'

import { UsersHeader } from '../snippets/UsersHeader'
import { UserView } from '../views/User'

const UserRouter = React.lazy(() => import('./User'))

const Overview = () => (
    <>
        <UsersHeader/>
        <UserView/>
    </>
)

const UsersRouter = () => {
    return (
        <Switch>
            <Route path="/users/:userId" component={UserRouter}/>
            <Route path="/users" component={Overview}/>
        </Switch>
    )
}

export default UsersRouter