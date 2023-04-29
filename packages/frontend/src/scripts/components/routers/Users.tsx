import * as React from 'react'
import { Route, Switch } from 'react-router'

import { UserView } from '../views/User'

const UserRouter = React.lazy(() => import('./User'))

const UsersRouter = () => {
    return (
        <Switch>
            <Route path="/users/:user" component={UserRouter}/>
            <Route path="/users" component={UserView}/>
        </Switch>
    )
}

export default UsersRouter