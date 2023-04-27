import * as React from 'react'
import { Redirect, useHistory } from 'react-router'

import { AuthContext } from '../../contexts/Auth'
import { UserManager } from '../../managers/user'

import AuthIcon from '/src/images/auth.png'

export const AuthConsentView = () => {
    const { push } = useHistory()

    // CONTEXTS

    const { authContextUser, setAuthContextUser } = React.useContext(AuthContext)

    // STATES

    const [load, setLoad] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>()

    // FUNCTIONS

    async function handleAgree(event: React.UIEvent) {
        try {
            event.preventDefault()
            setLoad(true)
            setError(undefined)
            const user = await UserManager.updateUser(authContextUser.id, { consent: true, name: authContextUser.name })
            setAuthContextUser(user)
            setLoad(false)
            push('/auth/name')
        } catch (e) {
            setError('Action failed.')
            setLoad(false)
        }
    }
    async function handleCancel(event: React.UIEvent) {
        event.preventDefault()
        push('/')
    }

    return (
        authContextUser ? (
            <main className='view reduced auth'>
                <main>
                    <div>
                        <div>
                            <div>
                                <img src={AuthIcon}/>
                                <h5>Authentication process</h5>
                                <h1>Step 3: <span>User agreement</span></h1>
                                <p>
                                    Please read carefully our <strong>terms of use</strong> and <strong>privacy policy</strong>.
                                    Then <strong>agree</strong> or <strong>cancel</strong> the authentication process.
                                </p>
                                <div>
                                    <button className='button fill lightgray' onClick={handleCancel}>
                                        Cancel
                                    </button>
                                    <button className='button fill blue' onClick={handleAgree}>
                                        {load ? 'Loading ...' : 'Agree'}
                                    </button>
                                </div>
                                {error && <p style={{color: 'red'}}>{error}</p>}
                            </div>
                        </div>
                    </div>
                </main>
            </main>
        ) : (
            <Redirect to="/auth"/>
        )
    )
}