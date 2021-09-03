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
import { AuditView } from './views/Audit'
import { VersionView } from './views/Version'
import { VersionsView } from './views/Versions'
import { ModelView } from './views/Model'
import { TestAPI } from '../mqtt'
import * as PlatformIcon from '/src/images/platform.png'
import { MemoView } from './views/Memo'

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
                <Route path="/audits/:audit/memo" component={MemoView}/>
                <Route path="/audits/:audit" component={AuditView}/>
                <Route path="/audits" component={AuditsView}/>
                <Route path="/products/:product/versions/:version" component={VersionView}/>
                <Route path="/products/:product/versions" component={VersionsView}/>
                <Route path="/products/:product" component={ProductView}/>
                <Route path="/products" component={ProductsView}/>
                <Route path="/models/:model" component={ModelView}/>
                <Route component={IndexView}/>
            </Switch>
        </BrowserRouter>
    </React.Fragment>
}