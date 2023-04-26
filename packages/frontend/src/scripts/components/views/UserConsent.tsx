import * as React from 'react'

import { UserContext } from '../../contexts/User'
import { UserManager } from '../../managers/user'

export const UserConsentView = () => {
    // CONTEXTS

    const { contextUser, setContextUser } = React.useContext(UserContext)

    // STATES

    const [load, setLoad] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>()

    // FUNCTIONS

    async function handleConsent(event: React.UIEvent) {
        try {
            event.preventDefault()
            setLoad(true)
            setError(undefined)
            const user = await UserManager.updateUser(contextUser.id, { consent: true, name: contextUser.name })
            setContextUser(user)
        } catch (e) {
            setError('Action failed.')
            setLoad(false)
        }
    }
    async function handleCancel(event: React.UIEvent) {
        event.preventDefault()
        setContextUser(null)
    }

    return (
        <main className='view reduced user-consent'>
            <main>
                <div>
                    <h5>Authentication process</h5>
                    <h1>Step 3: User agreement</h1>
                    <p>
                        Please read carefully our <strong>terms of use</strong> and <strong>privacy policy</strong>.
                        Then <strong>agree</strong> or <strong>cancel</strong> the authentication process.
                    </p>
                    <div>
                        <button className='button fill lightgray' onClick={handleCancel}>Cancel</button>
                        <button className='button fill blue' onClick={handleConsent}>Agree</button>
                    </div>
                    {!load && !error && <p style={{color: 'lightgray'}}>Waiting...</p>}
                    {load && <p style={{color: 'gray'}}>Loading...</p>}
                    {error && <p style={{color: 'red'}}>{error}</p>}
                </div>
            </main>
        </main>
    )
}