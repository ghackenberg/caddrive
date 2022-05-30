import * as React from 'react'
import { useContext, useEffect, useState } from 'react'
import * as hash from 'hash.js'
// Clients
import { auth } from '../../clients/auth'
// Managers
import { UserManager } from '../../managers/user'
// Inputs
import { EmailInput } from '../inputs/EmailInput'
import { PasswordInput } from '../inputs/PasswordInput'
import { UserContext } from '../../contexts/User'

export const LoginView = () => {

    const user = useContext(UserContext)

    // STATES

    const [load, setLoad] = useState<boolean>(false)
    const [error, setError] = useState<string>()
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

            user.update(await UserManager.checkUser())
        } catch (error) {
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
                    {error && <p style={{color: 'red'}}>{error}</p>}
                    <form onSubmit={submit} onReset={reset} className='data-input'>
                        <EmailInput label='Email' placeholder='Type email' value={email} change={setEmail}/>
                        <PasswordInput label='Password' placeholder='Type password' change={password => setPassword(encrypt(password))} required= {true}/>
                        <div>
                            <div/>
                            <div>
                                <input  type='submit' value='Login' disabled={load}/>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </main>
    )
    
}