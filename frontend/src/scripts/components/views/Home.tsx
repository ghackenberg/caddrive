import * as React from 'react'
import { Link } from 'react-router-dom'
import { HomeLink } from '../links/HomeLink'

export const HomeView = () => (

    <div className="view index">
        <header>
            <nav>
                <HomeLink/>
            </nav>
        </header>
        <main>
            <div>
                <h1>ProductHub</h1>
                <ul>
                    <li>
                        <Link to="/users">Users</Link>
                    </li>
                    <li>
                        <Link to="/products">Products</Link>
                    </li>
                </ul>
            </div>
        </main>
    </div>
    
)