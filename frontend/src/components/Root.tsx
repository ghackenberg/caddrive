import * as React from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { Index } from './views/Index'
import { Demo } from './views/Demo'

export class Root extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Helmet>
                    <title>FH OÖ Audit Platform Frontend</title>
                    <link rel="icon" href="/images/icon.png"/>
                    <link rel="stylesheet" href="/styles/main.css"/>
                </Helmet>
                <BrowserRouter>
                    <Switch>
                        <Route path="/demo" component={Demo}/>
                        <Route component={Index}/>
                    </Switch>
                </BrowserRouter>
            </React.Fragment>
        )
    }
}