import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { SearchBarList } from '../widgets/SearchBarList'


export const AuditsView = () =>  {

    return (
        <div className="view audits">
            <Header/>
            <Navigation/>
            <main>
                <Fragment>
                    <nav>
                        <span>
                            <Link to="/">Welcome Page</Link> 
                        </span>
                        <span>
                            <a>Audits</a>
                        </span>
                    </nav>
                </Fragment>
                <h2>Available audits</h2>
                <SearchBarList type='audits'/>
            </main>
        </div>
    )
}