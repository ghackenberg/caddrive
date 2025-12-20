import { useContext, useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router'
import { UserClient } from '../../clients/rest/user.js'
import { AuthContext } from '../../contexts/Auth.js'
import { pushState } from '../../functions/history.js'
import { LegalFooter } from '../snippets/LegalFooter.js'
import AuthIcon from '/src/images/auth.png'

export const AuthNameView = () => {

    // REFS

    const inputRef = useRef<HTMLInputElement>(null)

    // CONTEXTS

    const { authContextUser, setAuthContextUser } = useContext(AuthContext)

    // STATES

    const [name, setName] = useState<string>(authContextUser ? authContextUser.name || '' : '')
    const [load, setLoad] = useState<boolean>(false)
    const [error, setError] = useState<string>()

    // EFFECTS

    useEffect(() => {
        authContextUser && inputRef.current.focus()
    }, [authContextUser])

    // FUNCTIONS

    async function handleSubmit(event: React.UIEvent) {
        // TODO handle unmount!
        try {
            event.preventDefault()
            setLoad(true)
            setError(undefined)
            const user = await UserClient.updateUser(authContextUser.userId, { consent: authContextUser.consent, name, emailNotification: true })
            setAuthContextUser(user)
            setLoad(false)
            await pushState('/auth/picture')
        } catch (e) {
            setError('Action failed.')
            setLoad(false)
        }
    }

    return (
        authContextUser ? (
            <main className='view auth name'>
                <div>
                    <div className='main center'>
                        <div>
                            <img src={AuthIcon}/>
                            <h5>Authentication process</h5>
                            <h1>Step 4: <span>Profile name</span></h1>
                            <p>
                                How do you want to be called on our platform?
                                Note that your profile name will be visible to other users.
                            </p>
                            <div>
                                <input ref={inputRef} className='button fill lightgray' type='text' placeholder='Your profile name' value={name} onKeyUp={event => event.key == 'Enter' && handleSubmit(event)} onChange={event => setName(event.currentTarget.value)}/>
                                <button className='button fill red' onClick={handleSubmit}>
                                    {load ? 'Loading ...' : 'Next'}
                                </button>
                            </div>
                            {error && <p style={{color: 'var(--red)'}}>{error}</p>}
                        </div>
                    </div>
                    <LegalFooter/>
                </div>
            </main>
        ) : (
            <Navigate to="/auth"/>
        )
    )
}