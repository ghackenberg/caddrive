import  * as React from 'react'
import { useState, useEffect, FormEvent, useContext } from 'react'
import { Redirect, useParams } from 'react-router'

import { LoadingView } from './Loading'
import { auth } from '../../clients/auth'
import { UserClient } from '../../clients/rest/user'
import { UserContext } from '../../contexts/User'
import { useUser } from '../../hooks/entity'
import { useAsyncHistory } from '../../hooks/history'
import { BooleanInput } from '../inputs/BooleanInput'
import { ButtonInput } from '../inputs/ButtonInput'
import { EmailInput } from '../inputs/EmailInput'
import { FileInput } from '../inputs/FileInput'
import { TextInput } from '../inputs/TextInput'
import { LegalFooter } from '../snippets/LegalFooter'

export const UserSettingView = () => {

    // HISTORY
    
    const { goBack } = useAsyncHistory()
    
    // CONTEXTS

    const { contextUser, setContextUser } = useContext(UserContext)

    // PARAMS

    const { userId } = useParams<{ userId: string }>()
    
    // ENTITIES

    const user = useUser(userId)

    // STATES
    
    // - Values
    const [email, setEmail] = useState<string>(user ? user.email || '' : '')
    const [name, setName] = useState<string>(user ? user.name || '' : '')
    const [emailNotification, setEmailNotification] = useState<boolean>(user ? user.emailNotification : true)
    const [picture, setPicture] = useState<File>()

    // EFFECTS
    
    useEffect(() => { user && setEmail(user.email || '') }, [user])
    useEffect(() => { user && setName(user.name || '') }, [user])

    // FUNCTIONS 

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        // TODO handle unmount!
        event.preventDefault()
        if (name) {
            const newUser = await UserClient.updateUser(userId, { consent: user.consent, name, emailNotification }, picture)
            if (contextUser.userId == userId) {
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
                        <div className='main'>
                            <h1>
                                {userId == 'new' ? (
                                    'New user'
                                ) : (
                                    'User settings'
                                )}
                            </h1>
                            <form onSubmit={onSubmit}>
                                {email && (
                                    <EmailInput label='Email' disabled={true} value={email} change={setEmail}/>
                                )}
                                {contextUser && contextUser.userId == userId && (
                                    <TextInput label='Token' disabled={true} value={localStorage.getItem('jwt')}/>
                                )}
                                {true && (
                                    <TextInput label='Name' placeholder='Please enter your profile name here' value={name} change={setName}/>
                                )}
                                {true && (
                                    <FileInput label='Picture' placeholder='Select' accept='image/jpeg, image/png, image/bmp, image/tiff, image/gif' change={setPicture} required={userId === 'new'}/>
                                )}
                                {true && (
                                    <BooleanInput label='Email notification' value={emailNotification} change={setEmailNotification}/>
                                )}
                                {contextUser ? (
                                    contextUser.admin || userId == contextUser.userId ? (
                                        <ButtonInput value='Save'/>
                                    ) : (
                                        <ButtonInput value='Save' badge='requires permission' disabled={true}/>
                                    )
                                ) : (
                                    <ButtonInput value="Save" badge='requires login' disabled={true}/>
                                )}
                                {contextUser && contextUser.userId == userId && (
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