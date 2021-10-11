import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
import { User } from 'fhooe-audit-platform-common'
import { UserAPI } from '../../rest'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { EmailInput, TextInput } from '../snippets/Inputs'
import { UserLink } from '../snippets/Links'

export const UserEditView = (props: RouteComponentProps<{ user: string }>) => {

    const userId = props.match.params.user
    
    const history = useHistory()

    const [user, setUser] = useState<User>(null)

    const [name, setName] = useState<string>(null)
    const [email, setEmail] = useState<string>(null)

    useEffect(() => { userId == 'new' || UserAPI.getUser(userId).then(setUser) }, [props])

    async function saveUser(event: FormEvent){
        event.preventDefault()
        if(userId == 'new') {
            if (name && email) {
                const user = await UserAPI.addUser({ name, email })
                history.replace(`/users/${user.id}`)
            }
        } else {
            if (name && email) {
                setUser(await UserAPI.updateUser({ id: user.id, name, email}))
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
                                <UserLink user={user}/>
                            </nav>
                            <h1>User editor</h1>
                            <form onSubmit={saveUser} onReset={cancelInput} className='user-input'>
                                <TextInput 
                                    label='Username'
                                    placeholder='Type in username'
                                    value={user ? user.name : ''}
                                    change={value => setName(value)}/>
                                <EmailInput
                                    label='Email'
                                    placeholder='Type in email'
                                    value={user ? user.email : ''}
                                    change={value => setEmail(value)}/>
                                <div>
                                    <div/>
                                    <div>
                                        <input type="reset" value='Cancel'/>
                                        <input type="submit" value="Save" className='saveItem'/>
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