import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export const Audit = (props: RouteComponentProps<{id: string}>) => (
    <React.Fragment>
        <Header/>
        <Navigation/>
        <main>
            <h1><Link to="/">Index</Link> &rsaquo; <Link to="/audits">Audit</Link> &rsaquo; {props.match.params.id}</h1>
            <p>TODO</p>
        </main>
    </React.Fragment>
)