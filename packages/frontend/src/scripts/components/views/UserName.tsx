import * as React from 'react'

import { UserContext } from '../../contexts/User'
import { UserManager } from '../../managers/user'

export const UserNameView = () => {
    // CONTEXTS

    const { contextUser, setContextUser } = React.useContext(UserContext)

    // STATES

    const [name, setName] = React.useState<string>('')

    // FUNCTIONS

    async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault()
        const user = await UserManager.updateUser(contextUser.id, { consent: contextUser.consent, name })
        setContextUser(user)
    }

    return (
        <main className='view reduced user-name'>
            <main>
                <div>
                    <h5>Authentication process</h5>
                    <h1>Step 4: Profile name</h1>
                    <p>
                        How do you want to be called on our platform?
                        Note that your name will be visible to other users.
                    </p>
                    <div>
                        <input className='button fill lightgray' type='text' placeholder='Your profile name' value={name} onChange={event => setName(event.currentTarget.value)}/>
                        <button className='button fill blue' onClick={handleSubmit}>Next</button>
                    </div>
                </div>
            </main>
        </main>
    )
}