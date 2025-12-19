import { useContext } from 'react'
import { Navigate } from 'react-router'
import { AuthContext } from '../../contexts/Auth.js'
import { UserContext } from '../../contexts/User.js'
import { useAsyncHistory } from '../../hooks/history.js'
import { DESKTOP } from '../../platform.js'
import { LegalFooter } from '../snippets/LegalFooter.js'
import AuthIcon from '/src/images/auth.png'

export const AuthWelcomeView = () => {
    
    const { go } = useAsyncHistory()

    // CONTEXTS

    const { authContextUser } = useContext(AuthContext)
    const { setContextUser } = useContext(UserContext)

    // FUNCTIONS

    async function handleSubmit(event: React.UIEvent) {
        event.preventDefault()
        setContextUser(authContextUser)
        await go(DESKTOP ? -6 : -5) // [download,] picture, name, consent, email, root
    }

    return (
        authContextUser ? (
            <main className='view auth welcome'>
                <div>
                    <div className='main center'>
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
                                <button className='button fill red' onClick={handleSubmit}>
                                    Start
                                </button>
                            </div>
                        </div>
                    </div>
                    <LegalFooter/>
                </div>
            </main>
        ) : (
            <Navigate to="/auth"/>
        )
    )
}