import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { SearchBarList } from '../widgets/SearchBarList'

export const VersionsView = () => {

    return (
        <div className="view versions">
            <Header/>
            <Navigation/>
            <main>
                <Fragment>
                    <nav>
                        <span>
                            <Link to="/">Welcome Page</Link>
                        </span>
                        <span>
                            <a>Versions</a>
                        </span>
                    </nav>
                </Fragment>
                <h2>Available versions</h2>
                <SearchBarList type='versions'/>
            </main>
        </div>
    )
}