import * as React from 'react'

import { UserContext } from '../../contexts/User'
import { UserManager } from '../../managers/user'

export const AuthNameView = () => {
    // CONTEXTS

    const { contextUser, setContextUser } = React.useContext(UserContext)

    // STATES

    const [name, setName] = React.useState<string>('')

    const [load, setLoad] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>()

    // FUNCTIONS

    async function handleSubmit(event: React.UIEvent) {
        try {
            event.preventDefault()
            setLoad(true)
            setError(undefined)
            const user = await UserManager.updateUser(contextUser.id, { consent: contextUser.consent, name })
            setContextUser(user)
        } catch (e) {
            setError('Action failed.')
            setLoad(false)
        }
    }

    return (
        <main className='view reduced auth'>
            <main>
                <div>
                    <h5>Authentication process</h5>
                    <h1>Step 4: Profile name</h1>
                    <p>
                        How do you want to be called on our platform?
                        Note that your name will be visible to other users.
                    </p>
                    <div>
                        <input className='button fill lightgray' type='text' placeholder='Your profile name' value={name} onKeyUp={event => event.key == 'Enter' && handleSubmit(event)} onChange={event => setName(event.currentTarget.value)}/>
                        <button className='button fill blue' onClick={handleSubmit}>Next</button>
                    </div>
                    {!load && !error && <p style={{color: 'lightgray'}}>Waiting...</p>}
                    {load && <p style={{color: 'gray'}}>Loading...</p>}
                    {error && <p style={{color: 'red'}}>{error}</p>}
                </div>
            </main>
        </main>
    )
}