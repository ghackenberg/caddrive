import * as React from 'react'
import { Redirect, Route, Switch } from 'react-router'

import { LegalHeader } from '../snippets/LegalHeader'
import { LegalImprintView } from '../views/LegalImprint'
import { LegalPrivacyView } from '../views/LegalPrivacy'
import { LegalTermsView } from '../views/LegalTerms'

const LegalRouter = () => {
    return (
        <>
            <LegalHeader/>
            <Switch>
                <Route path="/legal/imprint" component={LegalImprintView}/>
                <Route path="/legal/privacy" component={LegalPrivacyView}/>
                <Route path="/legal/terms" component={LegalTermsView}/>
                <Redirect path="/legal" to="/legal/imprint"/>
            </Switch>
        </>
    )
}

export default LegalRouter