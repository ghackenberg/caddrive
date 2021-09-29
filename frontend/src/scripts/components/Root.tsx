import * as React from 'react'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { IndexView } from './views/Index'
import { UsersView } from './views/Users'
import { AuditsView } from './views/Audits'
import { ProductsView } from './views/Products'
import { UserView } from './views/User'
import { ProductView } from './views/Product'
import { AuditDetailView } from './views/AuditDetail'
import { ProductVersionView } from './views/ProductVersion'
import { VersionsView } from './views/Versions'
import { ModelView } from './views/Model'
import { TestAPI } from '../mqtt'
import * as PlatformIcon from '/src/images/platform.png'
import { AuditView } from './views/Audit'
import { VersionView } from './views/Version'
import { ProductVersionsView } from './views/ProductVersions'
import { EventsView } from './views/Events'

export const Root = () => {
    useEffect(() => {
        const interval = setInterval(() => {
            TestAPI.a('test-1')
            TestAPI.b('test-2')
        }, 1000)
        return () => clearInterval(interval)
    })
    return <React.Fragment>
        <Helmet>
            <link rel="icon" href={PlatformIcon}/>
        </Helmet>
        <BrowserRouter>
            <Switch>
                <Route path="/users/:user" component={UserView}/>
                <Route path="/users" component={UsersView}/>
                <Route path="/audits/:audit/event" component={AuditView}/>
                <Route path="/audits/:audit" component={AuditDetailView}/>
                <Route path="/audits" component={AuditsView}/>
                <Route path="/events" component={EventsView}/>
                <Route path="/products/:product/versions/:version" component={ProductVersionView}/>
                <Route path="/products/:product/versions" component={ProductVersionsView}/>
                <Route path="/products/:product" component={ProductView}/>
                <Route path="/products" component={ProductsView}/>
                <Route path="/versions/:version" component={VersionView}/>
                <Route path="/versions" component={VersionsView}/>
                <Route path="/models/:model" component={ModelView}/>
                <Route component={IndexView}/>
            </Switch>
        </BrowserRouter>
    </React.Fragment>
}