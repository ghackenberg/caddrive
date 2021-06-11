import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export const User = (props: RouteComponentProps<{id: string}>) => (
    <div className="view user">
        <Header/>
        <Navigation/>
        <main>
            <h1><Link to="/">Index</Link> &rsaquo; <Link to="/users">Users</Link> &rsaquo; {props.match.params.id}</h1>
            <p>TODO</p>
        </main>
    </div>
)