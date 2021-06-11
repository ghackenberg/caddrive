import * as React from 'react'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export const Index = () => (
    <div className="view index">
        <Header/>
        <Navigation/>
        <main>
            <h1>Index</h1>
            <p>Welcome!</p>
        </main>
    </div>
)