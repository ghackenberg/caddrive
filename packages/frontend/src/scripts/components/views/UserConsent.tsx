import * as React from 'react'

import { UserContext } from '../../contexts/User'
import { UserManager } from '../../managers/user'

export const UserConsentView = () => {
    // CONTEXTS

    const { contextUser, setContextUser } = React.useContext(UserContext)

    // FUNCTIONS

    async function handleConsent(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        const user = await UserManager.updateUser(contextUser.id, { consent: true, name: contextUser.name })
        setContextUser(user)
    }
    async function handleCancel(event: React.MouseEvent<HTMLButtonElement>) {
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
                </div>
            </main>
        </main>
    )
}