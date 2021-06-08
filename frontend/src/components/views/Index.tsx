import * as React from 'react'
import { Link } from 'react-router-dom'
import { Header } from '../snippets/Header'

export class Index extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Header/>
                <main style={{padding: '1em', paddingTop: '3em'}}>
                    <Link to="/demo">Demo</Link>
                </main>
            </React.Fragment>
        )
    }
}