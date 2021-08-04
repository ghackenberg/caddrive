import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import { UserAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export const User = (props: RouteComponentProps<{id: string}>) => {
    
    async function saveUser(){
        if(props.match.params.id == 'new')
            await UserAPI.addUser({id: 'test', email: '1234.1234@1234.com'})
        else
            await UserAPI.updateUser({id: props.match.params.id, email: 'test@test.com'})
    }
    
    return (
        <div className="view user">
            <Header/>
            <Navigation/>
            <main>
                <h1><Link to="/">Index</Link> &rsaquo; <Link to="/users">Users</Link> &rsaquo; {props.match.params.id}</h1>
                <button onClick={saveUser}>save</button>
            </main>
        </div>
    )
}