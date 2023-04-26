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
                    <h1>Consent</h1>
                    <form>
                        <button onClick={handleConsent}>Consent</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </form>
                </div>
            </main>
        </main>
    )
}