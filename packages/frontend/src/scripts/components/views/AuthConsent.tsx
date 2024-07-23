import * as React from 'react'
import { Redirect } from 'react-router'

import { UserClient } from '../../clients/rest/user'
import { AuthContext } from '../../contexts/Auth'
import { useAsyncHistory } from '../../hooks/history'
import { LegalFooter } from '../snippets/LegalFooter'

import AuthIcon from '/src/images/auth.png'

export const AuthConsentView = () => {

    const { push } = useAsyncHistory()

    // CONTEXTS

    const { authContextUser, setAuthContextUser } = React.useContext(AuthContext)

    // STATES

    const [load, setLoad] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>()

    // FUNCTIONS

    async function handleAgree(event: React.UIEvent) {
        // TODO handle unmount!
        try {
            event.preventDefault()
            setLoad(true)
            setError(undefined)
            const user = await UserClient.updateUser(authContextUser.userId, { consent: true, name: authContextUser.name, emailNotification: true })
            setAuthContextUser(user)
            setLoad(false)
            await push('/auth/name')
        } catch (e) {
            setError('Action failed.')
            setLoad(false)
        }
    }
    
    async function handleCancel(event: React.UIEvent) {
        event.preventDefault()
        await push('/')
    }

    return (
        authContextUser ? (
            <main className='view auth consent'>
                <div>
                    <div className='main center'>
                        <div>
                            <img src={AuthIcon}/>
                            <h5>Authentication process</h5>
                            <h1>Step 3: <span>User agreement</span></h1>
                            <p>
                                Please read carefully our <a href='https://caddrive.org/en/terms/' target='_blank'>terms of use</a> and <a href='https://caddrive.org/en/privacy/' target='_blank'>privacy policy</a>.
                                Then <strong>agree</strong> or <strong>cancel</strong> the authentication process.
                            </p>
                            <div>
                                <button className='button fill lightgray' onClick={handleCancel}>
                                    Cancel
                                </button>
                                <button className='button fill red' onClick={handleAgree}>
                                    {load ? 'Loading ...' : 'Agree'}
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