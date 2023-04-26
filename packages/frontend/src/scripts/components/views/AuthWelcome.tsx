import * as React from 'react'
import { NavLink } from 'react-router-dom'

import { UserContext } from '../../contexts/User'

export const AuthWelcomeView = () => {
    // CONTEXTS

    const { contextUser } = React.useContext(UserContext)

    return (
        <main className='view reduced auth'>
            <main>
                <div>
                    <h5>Authentication process</h5>
                    <h1>Done! 😀</h1>
                    <p>
                        Congratulations <strong>{contextUser.name}</strong>, you signed up successfully on our platform.
                        We wish you a <strong>great experience</strong> here!
                    </p>
                    <div>
                        <NavLink className='button fill blue' to="/">Start</NavLink>
                    </div>
                </div>
            </main>
        </main>
    )
}