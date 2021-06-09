import * as React from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export const Missing = () => (
    <React.Fragment>
        <Header/>
        <Navigation/>
        <main>
            <h1><Link to="/">Index</Link> &rsaquo; Missing</h1>
            <p>Please fix this error.</p>
        </main>
    </React.Fragment>
)