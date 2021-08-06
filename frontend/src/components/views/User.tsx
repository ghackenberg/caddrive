import  * as React from 'react'
import { useRef } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
import { UserAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export const User = (props: RouteComponentProps<{id: string, email: string}>) => {

    const userNameInput = useRef<HTMLInputElement>(null)
    const emailInput = useRef<HTMLInputElement>(null)
    const placeholderUserName = props.match.params.id
    const placeholderEmail = props.match.params.email
    const history = useHistory()

    async function saveUser(){
        if(props.match.params.id == 'new')
            if (userNameInput.current.value != '' && emailInput.current.value != '')
                await UserAPI.addUser({id: userNameInput.current.value, email: emailInput.current.value})
                
        else
            if (userNameInput.current.value != '')
                await UserAPI.updateUser({id: userNameInput.current.value, email: emailInput.current.value})
            else
                await UserAPI.updateUser({id: props.match.params.id, email: 'test@test.com'})

        history.goBack()
    }

    async function cancelInput() {
        history.goBack()
    }
        
    return (
        <div className="view user">
            <Header/>
            <Navigation/>
            <main>
                <h1><Link to="/">Welcome Page</Link> &rsaquo; <Link to="/users">Users</Link> &rsaquo; {props.match.params.id} User</h1>
                <label>
                    Username: <br></br>
                    <input ref={userNameInput} placeholder={ props.match.params.id=='new' ? 'Type in new username' : placeholderUserName}></input><br></br>
                    <br></br>
                    Email: <br></br>
                    <input ref={emailInput} placeholder={ props.match.params.id=='new' ? 'Type in new email' : placeholderEmail} size={40}></input><br></br>
                    <br></br>
                </label>
                <button onClick={cancelInput}>Cancel</button>
                <button onClick={saveUser}>Save</button>
            </main>
        </div>
    )
}