import * as React from 'react'

import { useAuth0 } from '@auth0/auth0-react'

export const LandingView = () => {

    const { loginWithRedirect } = useAuth0()

    // RETURN

    return (
        <main className="view reduced landing">
            <button className="button fill green position center" onClick={() => loginWithRedirect()}>Enter</button>
        </main>
    )

}