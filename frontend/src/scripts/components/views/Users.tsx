import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { SearchBarList } from '../widgets/SearchBarList'

export const UsersView = () => {

    return (
        <div className="view users">
            <Header/>
            <Navigation/>
            <main>
                <Fragment>
                    <nav>
                        <span>
                            <Link to="/">Welcome Page</Link> 
                        </span>
                        <span>
                            <a>Users</a>
                        </span>
                    </nav>
                </Fragment>
                <h2>Available users</h2>
                <SearchBarList type='users'/>
            </main>
        </div>
    )
}