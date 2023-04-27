import  * as React from 'react'
import { useState, useEffect, FormEvent, Fragment, useContext } from 'react'
import { Redirect, useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'

import { User } from 'productboard-common'

import { auth } from '../../clients/auth'
import { UserContext } from '../../contexts/User'
import { UserManager } from '../../managers/user'
import { ButtonInput } from '../inputs/ButtonInput'
import { EmailInput } from '../inputs/EmailInput'
import { FileInput } from '../inputs/FileInput'
import { SubmitInput } from '../inputs/SubmitInput'
import { TextInput } from '../inputs/TextInput'
import { UserHeader } from '../snippets/UserHeader'

export const UserSettingView = (props: RouteComponentProps<{ user: string }>) => {
    
    const { goBack, push } = useHistory()
    
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
    const [email, setEmail] = useState<string>(initialUser ? initialUser.email || '' : '')
    const [name, setName] = useState<string>(initialUser ? initialUser.name || '' : '')
    const [picture, setPicture] = useState<File>()

    // EFFECTS

    // - Entities
    useEffect(() => { userId != 'new' && UserManager.getUser(userId).then(setUser) }, [props])
    // - Values
    useEffect(() => { user && setEmail(user.email || '') }, [user])
    useEffect(() => { user && setName(user.name || '') }, [user])

    // FUNCTIONS 

    async function onSubmit(event: FormEvent<HTMLFormElement>){
        event.preventDefault()
        if (name && email) {
            const newUser = await UserManager.updateUser(user.id, { consent: user.consent, name }, picture)
            if (contextUser.email == newUser.email) {
                setContextUser({ ...contextUser, ...newUser })
            }
        }
        goBack() 
    }

    function onClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        localStorage.removeItem('jwt')
        auth.headers.Authorization = ''
        setContextUser(null)
        push('/')
    }

    // RETURN
        
    return (
        <main className="view extended user-setting">
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
                                        <EmailInput label='Email' disabled={true} value={email} change={setEmail}/>
                                        {contextUser && contextUser.id == userId && (
                                            <TextInput label='Token' disabled={true} value={localStorage.getItem('jwt')}/>
                                        )}
                                        <TextInput label='Name' placeholder='Please enter your profile name here' value={name} change={setName}/>
                                        <FileInput label='Picture' placeholder='Select' accept='.jpg' change={setPicture} required={userId === 'new'}/>
                                        {contextUser ? (
                                            userId == contextUser.id ? (
                                                <SubmitInput value='Save'/>
                                            ) : (
                                                <SubmitInput value='Save (requires permission)' disabled={true}/>
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