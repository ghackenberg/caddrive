import * as React from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Index } from './views/Index'
import { Demo } from './views/Demo'
import { Users } from './views/Users'
import { Audits } from './views/Audits'
import { Products } from './views/Products'
import { Missing } from './views/Missing'

export class Root extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>FH OÖ Audit Platform</title>
                    <link rel="icon" href="/images/platform.png"/>
                    <link rel="stylesheet" href="/styles/main.css"/>
                    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
                </Helmet>
                <BrowserRouter>
                    <Switch>
                        <Route path="/users/:id" component={Missing}/>
                        <Route path="/users" component={Users}/>
                        <Route path="/products/:id" component={Missing}/>
                        <Route path="/products" component={Products}/>
                        <Route path="/audits/:id" component={Missing}/>
                        <Route path="/audits" component={Audits}/>
                        <Route path="/demo" component={Demo}/>
                        <Route component={Index}/>
                    </Switch>
                </BrowserRouter>
            </React.Fragment>
        )
    }
}