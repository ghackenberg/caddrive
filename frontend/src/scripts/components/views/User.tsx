import  * as React from 'react'
import { useRef, useState, useEffect, Fragment } from 'react'
import { useHistory } from 'react-router'
import { Link, RouteComponentProps } from 'react-router-dom'
import { User as UserData } from 'fhooe-audit-platform-common'
import { UserAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'

export const User = (props: RouteComponentProps<{ id: string }>) => {

    const id = props.match.params.id

    const [user, setUser] = useState<UserData>(null)

    if (id != 'new') {
        useEffect(() => { UserAPI.getUser(id).then(setUser) }, [])
    }

    const userNameInput = useRef<HTMLInputElement>(null)
    const emailInput = useRef<HTMLInputElement>(null)
    
    const history = useHistory()

    async function saveUser(){
        if(id == 'new') {
            if (userNameInput.current.value != '' && emailInput.current.value != '') {
                await UserAPI.addUser({ name: userNameInput.current.value, email: emailInput.current.value})

                history.goBack()
            }
        }       
        else {
            if (userNameInput.current.value != '' && emailInput.current.value != '') {
                await UserAPI.updateUser({id: id, name: userNameInput.current.value, email: emailInput.current.value})

                history.goBack()
            }
        }       
    }

    async function cancelInput() {
        history.goBack()
    }
        
    return (
        <div className="view user">
            <Header/>
            <Navigation/>
            <main>
                <h1><Link to="/">Welcome Page</Link> &rsaquo; <Link to="/users">Users</Link> &rsaquo; {id} User</h1>
                {id == 'new' ? (<h2>Add new User</h2>) : (<h2>Change existing User</h2>)}
                {id == 'new' || user != null ? (    
                    <Fragment>
                        <label>
                            Username: <br></br>
                            <input ref={userNameInput} placeholder={ id=='new' ? 'Type in new username' : user.name}></input><br></br>
                            <br></br>
                            Email: <br></br>
                            <input ref={emailInput} placeholder={ id=='new' ? 'Type in new email' : user.email} size={40}></input><br></br>
                        </label>
                        <button onClick={cancelInput}>Cancel</button>
                        <button onClick={saveUser}>Save</button>
                    </Fragment>
                ) : (
                    <p>Loading...</p>
                )}
            </main>
        </div>
    )
}