import  * as React from 'react'
import { useRef, useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
import { User } from 'fhooe-audit-platform-common'
import { UserAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { LinkSource } from '../widgets/LinkSource'

export const UserView = (props: RouteComponentProps<{ user: string }>) => {

    const userId = props.match.params.user

    const userNameInput = useRef<HTMLInputElement>(null)
    const emailInput = useRef<HTMLInputElement>(null)
    
    const history = useHistory()

    const [user, setUser] = useState<User>(null)

    if (userId != 'new') {
        useEffect(() => { UserAPI.getUser(userId).then(setUser) }, [])
    }

    async function saveUser(event: FormEvent){
        event.preventDefault()

        if(userId == 'new') {
            if (userNameInput.current.value != '' && emailInput.current.value != '') {
                await UserAPI.addUser({ name: userNameInput.current.value, email: emailInput.current.value})

                history.goBack()
            }
        }       
        else {
            if (userNameInput.current.value != '' && emailInput.current.value != '') {
                await UserAPI.updateUser({id: userId, name: userNameInput.current.value, email: emailInput.current.value})

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
                                { user ? ( 
                                <LinkSource object={user} id={user.id} name={user.name} type='User'/> 
                                ) : (
                                <LinkSource object={'new'} id={'new'} name={'new'} type='User'/> 
                                )}
                            </nav>
                            <h1>{ userId == 'new' ? 'Add new user' : 'Change existing user' }</h1>
                            <form onSubmit={saveUser} onReset={cancelInput} className='user-input'>
                                <div>
                                    <div>
                                        <label>Username:</label>
                                    </div>
                                    <div>
                                        <input ref={userNameInput} placeholder={userId == 'new' ? "Add here new user" : user.name} />
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <label>Email:</label>
                                    </div>
                                    <div>
                                        <input type='email' ref={emailInput} placeholder={userId == 'new' ? 'Type in new email' : user.email} />
                                    </div>
                                </div>
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