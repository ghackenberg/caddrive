import * as React from 'react'
import { NavLink, Redirect } from 'react-router-dom'

import { UserContext } from '../../contexts/User'

import AuthIcon from '/src/images/auth.png'

export const AuthWelcomeView = () => {
    // CONTEXTS

    const { contextUser } = React.useContext(UserContext)

    return (
        contextUser ? (
            <main className='view reduced auth'>
                <main>
                    <div>
                        <img src={AuthIcon}/>
                        <h5>Authentication process</h5>
                        <h1>Done! 😀</h1>
                        <p>
                            Congrats <strong>{contextUser.name}</strong>!
                            You signed up successfully on our platform.
                            We wish you a <strong>great experience</strong> here.
                        </p>
                        <div>
                            <NavLink className='button fill blue' to="/">Start</NavLink>
                        </div>
                    </div>
                </main>
            </main>
        ) : (
            <Redirect to="/auth"/>
        )
    )
}