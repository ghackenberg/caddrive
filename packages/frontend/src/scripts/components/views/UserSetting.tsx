import { FormEvent, useContext, useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router'
import { auth } from '../../clients/auth.js'
import { UserClient } from '../../clients/rest/user.js'
import { UserContext } from '../../contexts/User.js'
import { back } from '../../functions/history.js'
import { useUser } from '../../hooks/entity.js'
import { BooleanInput } from '../inputs/BooleanInput.js'
import { ButtonInput } from '../inputs/ButtonInput.js'
import { EmailInput } from '../inputs/EmailInput.js'
import { FileInput } from '../inputs/FileInput.js'
import { TextInput } from '../inputs/TextInput.js'
import { LegalFooter } from '../snippets/LegalFooter.js'
import { LoadingView } from './Loading.js'

export const UserSettingView = () => {
    
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
        await back() 
    }

    async function onClick(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        localStorage.removeItem('jwt')
        auth.headers.Authorization = ''
        setContextUser(null)
        await back()
    }

    // RETURN
        
    return (
        (userId == 'new' || user) ? (
            (user && user.deleted) ? (
                <Navigate to='/'/>
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