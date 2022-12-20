import * as React from 'react'
//import { useContext, useEffect, useState } from 'react'

import { useAuth0 } from '@auth0/auth0-react'

//import { UserContext } from '../../contexts/User'
//import { UserManager } from '../../managers/user'
import { LoginButton } from '../inputs/LoginButton' //neu
import { LogoutButton } from '../inputs/LogoutButton' // neu
import { Profile } from '../inputs/Profile' // neu

export const LoginView = () => {

    // const contextUser = useContext(UserContext)
    // console.log(contextUser)

    const { isLoading, error } = useAuth0(); //neu
    const { user, isAuthenticated } = useAuth0();

    // STATES
    // EFFECTS

    // FUNCTIONS

    // RETURN

    return (
        <main className="view login">
            <main>
                <div>
                    {/* Neu */}
                    <h1>Auth0 Login</h1>
                    {error && <p>Authentication Error</p>}
                    {!error && isLoading && <p>Loading...</p>}
                    {!error && !isLoading && (
                        <>
                            <LoginButton />
                            <LogoutButton />
                            <Profile />
                        </>
                    )}
                    {isAuthenticated && (
                        <article className='column'>
                            {user?.picture && <img src={user.picture} alt={user?.name} />}
                            <h2>{user?.name}</h2>
                            <ul>
                                {Object.keys(user).map((objKey, i) => <li key={i}>{objKey}: {user[objKey]} </li>)}
                            </ul>
                        </article>
                    )}
                    {/* Neu */}

                </div>
            </main>
        </main>
    )

}