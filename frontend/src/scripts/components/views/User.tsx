import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
import { User } from 'fhooe-audit-platform-common'
import { UserAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { TextInput } from './forms/InputForms'
import { UserLink } from './forms/UserLink'

export const UserView = (props: RouteComponentProps<{ user: string }>) => {

    const userId = props.match.params.user
    
    const history = useHistory()

    const [user, setUser] = useState<User>(null)
    const [userName, setUserName] = useState<string>(null)
    const [userEmail, setUserEmail] = useState<string>(null)

    if (userId != 'new') {
        useEffect(() => { UserAPI.getUser(userId).then(setUser) }, [])
    }

    async function saveUser(event: FormEvent){
        event.preventDefault()

        if(userId == 'new') {
            if (userName != '' && userEmail != '') {
                await UserAPI.addUser({ name: userName, email: userEmail})

                history.goBack()
            }
        }       
        else {
            if (userName != '' && userEmail != '') {
                await UserAPI.updateUser({id: userId, name: userName, email: userEmail})

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
                    { userId == 'new' || user ? (
                        <Fragment>
                            <nav>
                                { user ? <UserLink user={user}/> : <UserLink/> }
                            </nav>
                            <h1>{ userId == 'new' ? 'Add new user' : 'Change existing user' }</h1>
                            <form onSubmit={saveUser} onReset={cancelInput} className='user-input'>
                                <TextInput  
                                    label='Username:'
                                    placeholder={userId == 'new' ? 'Add here new user' : user.name}
                                    change={value => setUserName(value)}/>
                                <TextInput  
                                    label='Email:'
                                    placeholder={userId == 'new' ? 'Type in new email' : user.email}
                                    change={value => setUserEmail(value)}/>
                                <div>
                                    <div/>
                                    <div>
                                        <input type="reset" value='Cancel'/>
                                        <input type="submit" value="Save"/>
                                    </div>
                                </div>
                            </form>
                        </Fragment>
                    ) : (
                        <p>Loading...</p>
                    )}
                </main>
        </div>
    )
}