import * as React from 'react'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export class Missing extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Header/>
                <Navigation/>
                <main>
                    <h1>View is missing!</h1>
                    <p>Please fix this error.</p>
                </main>
            </React.Fragment>
        )
    }
}