import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import { UserHeader } from '../snippets/UserHeader'
import { UserSettingView } from '../views/UserSetting'

const UserRouter = () => {
    return (
        <>
            <UserHeader/>
            <Switch>
                <Route path="/users/:user/settings" component={UserSettingView}/>
                <Redirect path="/users/:user" to="/users/:user/settings" push={false}/>
            </Switch>
        </>
    )
}

export default UserRouter