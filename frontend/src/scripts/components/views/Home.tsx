import * as React from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export const HomeView = () => (

    <div className="view index">
        <Header/>
        <Navigation/>
        <main>
            <h1>Home</h1>
            <h2>Welcome to the FH O&Ouml; VIRUTAL ENGINEERING PLATFORM !</h2>
            <p>Please choose between <Link to="/users">Users</Link> and <Link to="/products">Products</Link>.</p>
        </main>
    </div>
    
)