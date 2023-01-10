import  * as React from 'react'
import { useState, useEffect, FormEvent, Fragment, useContext } from 'react'
import { Redirect, useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'

import { useAuth0 } from '@auth0/auth0-react'

import { User } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { UserManager } from '../../managers/user'
import { EmailInput } from '../inputs/EmailInput'
import { FileInput } from '../inputs/FileInput'
import { TextInput } from '../inputs/TextInput'
import { UserHeader } from '../snippets/UserHeader'

export const UserSettingView = (props: RouteComponentProps<{ user: string }>) => {
    
    const { goBack } = useHistory()

    const { logout } = useAuth0()
    
    // CONTEXTS

    const contextUser = useContext(UserContext)
    
    // PARAMS

    const userId = props.match.params.user

    // INITIAL STATES
    
    const initialUser = userId == 'new' ? undefined : UserManager.getUserFromCache(userId)

    // STATES
    
    // - Entities
    const [user, setUser] = useState<User>(initialUser)
    // - Values
    const [email, setEmail] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [file, setFile] = useState<File>()

    // EFFECTS

    // - Entities
    useEffect(() => { userId != 'new' && UserManager.getUser(userId).then(setUser) }, [props])
    // - Values
    useEffect(() => { user && setEmail(user.email) }, [user])
    useEffect(() => { user && setName(user.name) }, [user])

    // FUNCTIONS 

    async function submit(event: FormEvent){
        event.preventDefault()
        if(userId == 'new') {
            if (name && email) {
                await UserManager.addUser({ name, email },file)
            }
        } else {
            if (name && email) {
                const newUser = await UserManager.updateUser(user.id, { name, email },file)
                if (contextUser.email == newUser.email) {
                    contextUser.update({ ...contextUser, ...newUser })
                }
            }
        }
        goBack() 
    }

    function click(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        logout()
    }

    // RETURN
        
    return (
        <main className="view extended user">
            { (userId == 'new' || user) && (
                <Fragment>
                    { user && user.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <UserHeader user={user}/>
                            <main>
                                <div>
                                    <h1>Settings</h1>
                                    <form onSubmit={submit}>
                                        <TextInput label='Name' placeholder='Type name' value={name} change={setName}/>
                                        <EmailInput label='Email' placeholder='Type email' value={email} change={setEmail}/>
                                        <FileInput label='Picture' placeholder='Select .jpg file' accept='.jpg' change={setFile} required= {userId === 'new'}/>
                                        <div>
                                            <div/>
                                            <div>
                                                <input type='submit' value='Save'/>
                                            </div>
                                        </div>
                                        { contextUser.id == userId && (
                                            <div>
                                                <div/>
                                                <div>
                                                    <button onClick={click}>Leave</button>
                                                </div>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </main>
                        </Fragment>
                    )}
                </Fragment>
            )}
        </main>
    )
}
