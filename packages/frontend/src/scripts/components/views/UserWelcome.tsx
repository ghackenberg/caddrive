import * as React from 'react'
import { NavLink } from 'react-router-dom'

import { UserContext } from '../../contexts/User'

export const UserWelcomeView = () => {
    // CONTEXTS

    const { contextUser } = React.useContext(UserContext)

    return (
        <main className='view reduced user-welcome'>
            <main>
                <div>
                    <h1>Welcome</h1>
                    <form>
                        Welcome {contextUser.name}! <NavLink to="/">Start</NavLink>
                    </form>
                </div>
            </main>
        </main>
    )
}