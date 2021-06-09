import * as React from 'react'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export const Index = () => (
    <React.Fragment>
        <Header/>
        <Navigation/>
        <main>
            <h1>Index</h1>
            <p>Welcome!</p>
        </main>
    </React.Fragment>
)