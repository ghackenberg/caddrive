import * as React from 'react'
import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Index } from './views/Index'
import { Demo } from './views/Demo'
import { Users } from './views/Users'
import { Audits } from './views/Audits'
import { Products } from './views/Products'
import { User } from './views/User'
import { Product } from './views/Product'
import { Audit } from './views/Audit'
import { TestAPI } from '../mqtt'

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
            <title>FH OÖ Product Audit Platform</title>
            <link rel="icon" href="/images/platform.png"/>
            <link rel="stylesheet" href="/styles/main.css"/>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
        </Helmet>
        <BrowserRouter>
            <Switch>
                <Route path="/users/:id" component={User}/>
                <Route path="/users" component={Users}/>
                <Route path="/products/:id" component={Product}/>
                <Route path="/products" component={Products}/>
                <Route path="/audits/:id" component={Audit}/>
                <Route path="/audits" component={Audits}/>
                <Route path="/demo" component={Demo}/>
                <Route component={Index}/>
            </Switch>
        </BrowserRouter>
    </React.Fragment>
}