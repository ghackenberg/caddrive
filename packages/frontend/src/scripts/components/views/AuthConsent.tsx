import * as React from 'react'
import { Redirect } from 'react-router'
import { NavLink } from 'react-router-dom'

import { AuthContext } from '../../contexts/Auth'
import { useAsyncHistory } from '../../hooks/history'
import { UserManager } from '../../managers/user'
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
            const user = await UserManager.updateUser(authContextUser.id, { consent: true, name: authContextUser.name })
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
                    <div>
                        <div>
                            <img src={AuthIcon}/>
                            <h5>Authentication process</h5>
                            <h1>Step 3: <span>User agreement</span></h1>
                            <p>
                                Please read carefully our <NavLink to='/legal/terms'>terms of use</NavLink> and <NavLink to='/legal/policy'>privacy policy</NavLink>.
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
                    <LegalFooter/>
                </div>
            </main>
        ) : (
            <Redirect to="/auth"/>
        )
    )
}