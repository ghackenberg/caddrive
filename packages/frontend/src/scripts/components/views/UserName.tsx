import * as React from 'react'

import { UserContext } from '../../contexts/User'
import { UserManager } from '../../managers/user'

export const UserNameView = () => {
    // CONTEXTS

    const { contextUser, setContextUser } = React.useContext(UserContext)

    // STATES

    const [name, setName] = React.useState<string>()

    // FUNCTIONS

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const user = await UserManager.updateUser(contextUser.id, { consent: contextUser.consent, name })
        setContextUser(user)
    }

    async function handleReset(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setContextUser(null)
    }

    return (
        <main className='view reduced user-name'>
            <main>
                <div>
                    <h1>Name</h1>
                    <form onSubmit={handleSubmit} onReset={handleReset}>
                        <label>Name: </label>
                        <input type="text" value={name} onChange={event => setName(event.currentTarget.value)}/>
                        <input type="submit"/>
                        <input type="reset"/>
                    </form>
                </div>
            </main>
        </main>
    )
}