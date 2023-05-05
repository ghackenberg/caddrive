import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import { UserHeader } from '../snippets/UserHeader'
import { UserSettingView } from '../views/UserSetting'

const UserRouter = () => {
    return (
        <>
            <UserHeader/>
            <Switch>
                <Route path="/users/:userId/settings" component={UserSettingView}/>
                <Redirect path="/users/:userId" to="/users/:userId/settings" push={false}/>
            </Switch>
        </>
    )
}

export default UserRouter