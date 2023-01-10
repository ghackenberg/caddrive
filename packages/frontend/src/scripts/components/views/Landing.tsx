import * as React from 'react'

import { useAuth0 } from '@auth0/auth0-react'

export const LandingView = () => {

    const { isLoading, isAuthenticated, error, loginWithRedirect, logout } = useAuth0()

    // RETURN

    return (
        <main className="view reduced landing">
            <main>
                <div>
                    <h1>Authentication</h1>
                    {isLoading ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            {error ? (
                                <p>Error</p>
                            ) : (
                                <>
                                    {isAuthenticated ? (
                                        <button onClick={() => logout()}>Leave</button>
                                    ) : (
                                        <button onClick={() => loginWithRedirect()}>Enter</button>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </main>
        </main>
    )

}