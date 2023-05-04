import * as React from 'react'
import { Redirect } from 'react-router-dom'

import { AuthContext } from '../../contexts/Auth'
import { UserContext } from '../../contexts/User'
import { useAsyncHistory } from '../../hooks/history'
import { LegalFooter } from '../snippets/LegalFooter'

import AuthIcon from '/src/images/auth.png'

export const AuthWelcomeView = () => {
    
    const { go } = useAsyncHistory()

    // CONTEXTS

    const { authContextUser } = React.useContext(AuthContext)
    const { setContextUser } = React.useContext(UserContext)

    // FUNCTIONS

    async function handleSubmit(event: React.UIEvent) {
        event.preventDefault()
        setContextUser(authContextUser)
        await go(-5) // picture, name, consent, email, root
    }

    return (
        authContextUser ? (
            <>
                <main className='view auth welcome'>
                    <div>
                        <div>
                            <div>
                                <img src={AuthIcon}/>
                                <h5>Authentication process</h5>
                                <h1>Done! 😀</h1>
                                <p>
                                    Congrats <strong>{authContextUser.name}</strong>!
                                    You signed up successfully on our platform.
                                    We wish you a <strong>great experience</strong> here.
                                </p>
                                <div>
                                    <button className='button fill blue' onClick={handleSubmit}>
                                        Start
                                    </button>
                                </div>
                            </div>
                        </div>
                        <LegalFooter/>
                    </div>
                </main>
            </>
        ) : (
            <Redirect to="/auth"/>
        )
    )
}