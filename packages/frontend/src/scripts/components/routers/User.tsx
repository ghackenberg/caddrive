import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import { UserSettingView } from '../views/UserSetting'

const UserRouter = () => {
    return (
        <Switch>
            <Route path="/users/:user/settings" component={UserSettingView}/>
            <Redirect path="/users/:user" to="/users/:user/settings"/>
        </Switch>
    )
}

export default UserRouter