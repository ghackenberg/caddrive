import * as React from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export const IndexView = () => (
    <div className="view index">
        <Header/>
        <Navigation/>
        <main>
            <h1>Welcome Page</h1>
            <h2>Welcome to the VIRUTAL ENGINEERING PLATFORM !</h2>
            <p>Please choose between <Link to="/users">Users</Link>, <Link to="/products">Products</Link> or <Link to="/audits">Audits</Link>.</p>
        </main>
    </div>
)