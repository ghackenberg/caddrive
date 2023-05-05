import  * as React from 'react'
import { useState, useEffect, FormEvent, useContext } from 'react'
import { Redirect } from 'react-router'

import { auth } from '../../clients/auth'
import { UserContext } from '../../contexts/User'
import { useAsyncHistory } from '../../hooks/history'
import { useRouteUser } from '../../hooks/route'
import { UserManager } from '../../managers/user'
import { ButtonInput } from '../inputs/ButtonInput'
import { EmailInput } from '../inputs/EmailInput'
import { FileInput } from '../inputs/FileInput'
import { SubmitInput } from '../inputs/SubmitInput'
import { TextInput } from '../inputs/TextInput'
import { LegalFooter } from '../snippets/LegalFooter'
import { LoadingView } from './Loading'

export const UserSettingView = () => {
    
    const { goBack } = useAsyncHistory()
    
    // CONTEXTS

    const { contextUser, setContextUser } = useContext(UserContext)
    
    // HOOKS

    const { userId, user } = useRouteUser()

    // STATES
    
    // - Values
    const [email, setEmail] = useState<string>(user ? user.email || '' : '')
    const [name, setName] = useState<string>(user ? user.name || '' : '')
    const [picture, setPicture] = useState<File>()

    // EFFECTS

    // - Values
    useEffect(() => { user && setEmail(user.email || '') }, [user])
    useEffect(() => { user && setName(user.name || '') }, [user])

    // FUNCTIONS 

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        // TODO handle unmount!
        event.preventDefault()
        if (name && email) {
            const newUser = await UserManager.updateUser(user.id, { consent: user.consent, name }, picture)
            if (contextUser.email == newUser.email) {
                setContextUser({ ...contextUser, ...newUser })
            }
        }
        await goBack() 
    }

    async function onClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        localStorage.removeItem('jwt')
        auth.headers.Authorization = ''
        setContextUser(null)
        await goBack()
    }

    // RETURN
        
    return (
        (userId == 'new' || user) ? (
            (user && user.deleted) ? (
                <Redirect to='/'/>
            ) : (
                <main className="view user-setting">
                    <div>
                        <div>
                            <h1>{userId == 'new' ? 'New user' : 'User settings'}</h1>
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
                        <LegalFooter/>
                    </div>
                </main>
            )
        ) : (
            <LoadingView/>
        )
    )
}