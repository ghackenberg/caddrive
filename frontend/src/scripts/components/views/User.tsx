import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
import { User } from 'fhooe-audit-platform-common'
import { UserAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { EmailInput, TextInput } from '../snippets/InputForms'
import { UserLink } from '../snippets/LinkSource'

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
            if (userName && userEmail) {
                await UserAPI.addUser({ name: userName, email: userEmail})

                history.goBack()
            }
        }       
        else {
            await UserAPI.updateUser({  id: user.id, 
                                        name: userName ? userName : user.name,
                                        email: userEmail ? userEmail : user.email})

            history.goBack()   
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
                                <UserLink user={user}/>
                            </nav>
                            <h1>{ userId == 'new' ? 'Add new user' : 'Change existing user' }</h1>
                            <form onSubmit={saveUser} onReset={cancelInput} className='user-input'>
                                <TextInput 
                                    label='Username'
                                    placeholder='Type in username'
                                    value={user ? user.name : undefined}
                                    change={value => setUserName(value)}/>
                                <EmailInput
                                    label='Email'
                                    placeholder='Type in email'
                                    value={user ? user.email : undefined}
                                    change={value => setUserEmail(value)}/>
                                <div>
                                    <div/>
                                    <div>
                                        <Fragment>
                                            <input type="reset" value='Cancel'/>
                                            <input  type="submit" 
                                                    value={userName || userEmail ? "Save" : "Delete"} 
                                                    className={userName || userEmail ? 'saveItem' : 'deleteItem'}/>                                            
                                        </Fragment>
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