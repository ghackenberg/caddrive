import * as React from 'react'
import { Link } from 'react-router-dom'
// Snippets
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export const MissingView = () => (
    
    <div className="view missing">
        <Header/>
        <Navigation/>
        <main>
            <h1><Link to="/">Home</Link> &rsaquo; Missing</h1>
            <p>Please fix this error.</p>
        </main>
    </div>

)