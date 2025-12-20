import { useContext, useEffect, useRef, useState } from 'react'
import { TokenClient } from '../../clients/rest/token.js'
import { AuthContext } from '../../contexts/Auth.js'
import { push } from '../../functions/history.js'
import { LegalFooter } from '../snippets/LegalFooter.js'
import AuthIcon from '/src/images/auth.png'

export const AuthEmailView = () => {

    // REFS

    const inputRef = useRef<HTMLInputElement>(null)

    // CONTEXTS

    const { setAuthContextToken } = useContext(AuthContext)

    // STATES

    const [email, setEmail] = useState<string>('')
    const [load, setLoad] = useState<boolean>(false)
    const [error, setError] = useState<string>()

    // EFFECTS

    useEffect(() => {
        inputRef.current.focus()
    })

    // EVENTS

    async function handleSubmit(event: React.UIEvent) {
        // TODO handle unmount!
        try {
            event.preventDefault()
            setLoad(true)
            setError(undefined)
            const token = await TokenClient.createToken({ email })
            setAuthContextToken(token.tokenId)
            setLoad(false)
            await push(`/auth/code`)
        } catch (e) {
            setError('Action failed.')
            setLoad(false)
        }
    }

    return (
        <main className="view auth email">
            <div>
                <div className='main center'>
                    <div>
                        <img src={AuthIcon}/>
                        <h5>Authentication process</h5>
                        <h1>Step 1: <span>Email address</span></h1>
                        <p>
                            Please enter your <strong>email address</strong> and press <strong>next</strong>.
                            Then we will send you a <strong>verification code</strong> to sign up/in.
                        </p>
                        <div>
                            <input ref={inputRef} className='button fill lightgray' type="email" placeholder='Your email address' value={email} onKeyUp={event => event.key == 'Enter' && handleSubmit(event)} onChange={event => setEmail(event.currentTarget.value)}/>
                            <button className='button fill red' onClick={handleSubmit} >
                                {load ? 'Loading ...' : 'Next'}
                            </button>
                        </div>
                        {error && <p style={{color: 'var(--red)'}}>{error}</p>}
                    </div>
                </div>
                <LegalFooter/>
            </div>
        </main>
    )
}