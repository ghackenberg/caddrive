import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export const Audit = (props: RouteComponentProps<{id: string}>) => (
    <div className="view audit">
        <Header/>
        <Navigation/>
        <main>
            <h1><Link to="/">Index</Link> &rsaquo; <Link to="/audits">Audits</Link> &rsaquo; {props.match.params.id}</h1>
            <p>TODO</p>
        </main>
    </div>
)