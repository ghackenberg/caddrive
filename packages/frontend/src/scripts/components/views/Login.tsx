import * as React from 'react'
import * as hash from 'hash.js'
// Commons
import { User } from 'productboard-common'
// Clients
import { auth } from '../../clients/auth'
// Managers
import { UserManager } from '../../managers/user'
// Inputs
import { EmailInput } from '../inputs/EmailInput'
import { PasswordInput } from '../inputs/PasswordInput'

export const LoginView = (props: {callback: (user: User) => void}) => {

    const [load, setLoad] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>()
    const [email, setEmail] = React.useState<string>(localStorage.getItem('username') || '')
    const [password, setPassword] = React.useState<string>(localStorage.getItem('password') || '')

    async function check() {
        setLoad(true)

        auth.username = email
        auth.password = password
        
        try {
            props.callback(await UserManager.checkUser())
        } catch (error) {
            setError('Login failed!')
            setLoad(false)
        }
    }

    async function submit(event: React.FormEvent) {
        event.preventDefault()

        localStorage.setItem('username', email)
        localStorage.setItem('password', password)

        await check()
    }

    async function reset() {
        setEmail('')
        setPassword('')
    }

    function encrypt(password: string): string {
        return hash.sha256().update(password).digest('hex')
    }

    React.useEffect(() => { check() }, [])

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