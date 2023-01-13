import  * as React from 'react'
import { useState, useEffect, FormEvent, Fragment, useContext } from 'react'
import { Redirect, useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'

import { useAuth0 } from '@auth0/auth0-react'

import { User } from 'productboard-common'

import { UserContext } from '../../contexts/User'
import { UserManager } from '../../managers/user'
import { ButtonInput } from '../inputs/ButtonInput'
import { EmailInput } from '../inputs/EmailInput'
import { FileInput } from '../inputs/FileInput'
import { SubmitInput } from '../inputs/SubmitInput'
import { TextInput } from '../inputs/TextInput'
import { UserHeader } from '../snippets/UserHeader'

export const UserSettingView = (props: RouteComponentProps<{ user: string }>) => {
    
    const { goBack } = useHistory()

    const { logout } = useAuth0()
    
    // CONTEXTS

    const { contextUser, setContextUser } = useContext(UserContext)
    
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

    async function onSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        if (name && email) {
            const newUser = await UserManager.updateUser(user.id, { name, email },file)
            if (contextUser.email == newUser.email) {
                setContextUser({ ...contextUser, ...newUser })
            }
        }
        goBack() 
    }

    function onClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        logout()
    }

    // RETURN
        
    return (
        <main className="view extended user">
            {(userId == 'new' || user) && (
                <Fragment>
                    { user && user.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <UserHeader user={user}/>
                            <main>
                                <div>
                                    <h1>Settings</h1>
                                    <form onSubmit={onSubmit}>
                                        <TextInput label='Name' placeholder='Type name' value={name} change={setName}/>
                                        <EmailInput label='Email' placeholder='Type email' value={email} change={setEmail}/>
                                        <FileInput label='Picture' placeholder='Select JPEG file' accept='.jpg' change={setFile} required={userId === 'new'}/>
                                        {contextUser ? (
                                            userId == contextUser.id || contextUser.permissions.includes('create:users') ? (
                                                <SubmitInput value='Save'/>
                                            ) : (
                                                <SubmitInput value='Save (requires role)' disabled={true}/>
                                            )
                                        ) : (
                                            <SubmitInput value="Save (requires login)" disabled={true}/>
                                        )}
                                        {contextUser && contextUser.id == userId && (
                                            <ButtonInput value='Leave' class='red' click={onClick}/>
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