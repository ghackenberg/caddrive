import * as React from 'react'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Index } from './views/Index'
import { Users } from './views/Users'
import { Audits } from './views/Audits'
import { Products } from './views/Products'
import { User } from './views/User'
import { Product } from './views/Product'
import { Audit } from './views/Audit'
import { Version } from './views/Version'
import { Versions } from './views/Versions'
import { Model } from './views/Model'
import { TestAPI } from '../mqtt'
import * as PlatformIcon from '/src/images/platform.png'

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
                <Route path="/users/:id" component={User}/>
                <Route path="/users" component={Users}/>
                <Route path="/products/:id" component={Product}/>
                <Route path="/products" component={Products}/>
                <Route path="/audits/:id" component={Audit}/>
                <Route path="/audits" component={Audits}/>
                <Route path="/versions/:id" component={Version}/>
                <Route path="/versions" component={Versions}/>
                <Route path="/models/:id" component={Model}/>
                <Route component={Index}/>
            </Switch>
        </BrowserRouter>
    </React.Fragment>
}