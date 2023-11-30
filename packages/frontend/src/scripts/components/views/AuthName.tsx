import * as React from 'react'
import { Redirect } from 'react-router'

import { UserClient } from '../../clients/rest/user'
import { AuthContext } from '../../contexts/Auth'
import { useAsyncHistory } from '../../hooks/history'
import { LegalFooter } from '../snippets/LegalFooter'

import AuthIcon from '/src/images/auth.png'

export const AuthNameView = () => {

    const { push } = useAsyncHistory()

    // REFS

    const inputRef = React.useRef<HTMLInputElement>()

    // CONTEXTS

    const { authContextUser, setAuthContextUser } = React.useContext(AuthContext)

    // STATES

    const [name, setName] = React.useState<string>(authContextUser ? authContextUser.name || '' : '')
    const [load, setLoad] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>()

    // EFFECTS

    React.useEffect(() => {
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
            await push('/auth/picture')
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
            <Redirect to="/auth"/>
        )
    )
}