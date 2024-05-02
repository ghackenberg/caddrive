import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import { AuthCodeView } from '../views/AuthCode'
import { AuthConsentView } from '../views/AuthConsent'
import { AuthDownloadView } from '../views/AuthDownload'
import { AuthEmailView } from '../views/AuthEmail'
import { AuthNameView } from '../views/AuthName'
import { AuthPictureView } from '../views/AuthPicture'
import { AuthWelcomeView } from '../views/AuthWelcome'

const AuthRouter = () => {
    return (
        <Switch>
            <Route path="/auth/email" component={AuthEmailView}/>
            <Route path="/auth/code" component={AuthCodeView}/>
            <Route path="/auth/consent" component={AuthConsentView}/>
            <Route path="/auth/name" component={AuthNameView}/>
            <Route path="/auth/picture" component={AuthPictureView}/>
            <Route path="/auth/download" component={AuthDownloadView}/>
            <Route path="/auth/welcome" component={AuthWelcomeView}/>
            <Redirect path="/auth" to="/auth/email" push={false}/>
        </Switch>
    )
}

export default AuthRouter