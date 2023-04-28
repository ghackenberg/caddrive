import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import { UserView } from '../views/User'
import { UserSettingView } from '../views/UserSetting'

const UserRouter = () => {
    return (
        <Switch>
            <Route path="/users/:user/settings" component={UserSettingView}/>
            <Redirect path="/users/:user" to="/users/:user/settings"/>
            
            <Route path="/users" component={UserView}/>
        </Switch>
    )
}

export default UserRouter