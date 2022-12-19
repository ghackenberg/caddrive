import * as React from 'react'
import { useContext, useEffect, useState } from 'react'

import { useAuth0 } from '@auth0/auth0-react'
import * as hash from 'hash.js'

import { auth } from '../../clients/auth'
import { UserContext } from '../../contexts/User'
import { UserManager } from '../../managers/user'
import { EmailInput } from '../inputs/EmailInput'
import { LoginButton } from '../inputs/LoginButton' //neu
import { LogoutButton } from '../inputs/LogoutButton' // neu
import { PasswordInput } from '../inputs/PasswordInput' //neu
import { Profile } from '../inputs/Profile' // neu

export const LoginView = () => {

    const contextUser = useContext(UserContext)

    const { isLoading, error } = useAuth0(); //neu

    // STATES

    const [load, setLoad] = useState<boolean>(false)
    const [error1, setError] = useState<string>()
    const [email, setEmail] = useState<string>(localStorage.getItem('username') || '')
    const [password, setPassword] = useState<string>(localStorage.getItem('password') || '')

    // EFFECTS

    useEffect(() => { check() }, [])

    // FUNCTIONS

    async function check() {
        try {
            setLoad(true)

            auth.username = email
            auth.password = password

            contextUser.update(await UserManager.checkUser())
        } catch (error1) {
            setError('Login failed!')
            setLoad(false)
        }
    }

    async function submit(event: React.FormEvent) {
        event.preventDefault()
        await check()
    }

    async function reset() {
        setEmail('')
        setPassword('')
    }

    function encrypt(password: string): string {
        return hash.sha256().update(password).digest('hex')
    }

    // RETURN

    return (
        <main className="view login">
            <main>
                <div>
                    <h1>Login</h1>
                    {error1 && <p style={{ color: 'red' }}>{error1}</p>}
                    <form onSubmit={submit} onReset={reset} className='data-input'>
                        <EmailInput label='Email' placeholder='Type email' value={email} change={setEmail} />
                        <PasswordInput label='Password' placeholder='Type password' change={password => setPassword(encrypt(password))} required={true} />
                        <div>
                            <div />
                            <div>
                                <input type='submit' value='Login' disabled={load} />
                            </div>
                        </div>
                    </form>

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

                </div>
            </main>
        </main>
    )

}