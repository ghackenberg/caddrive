import  * as React from 'react'
import { useState, useEffect, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
import * as hash from 'hash.js'
// Commons
import { User } from 'fhooe-audit-platform-common'
// Clients
import { UserAPI } from '../../../clients/rest'
// Links
import { UserLink } from '../../links/UserLink'
// Inputs
import { TextInput } from '../../inputs/TextInput'
import { EmailInput } from '../../inputs/EmailInput'
import { PasswordInput } from '../../inputs/PasswordInput'

export const UserEditView = (props: RouteComponentProps<{ user: string }>) => {

    const userId = props.match.params.user
    
    const history = useHistory()

    // Define entities
    const [user, setUser] = useState<User>()

    // Define values
    const [email, setEmail] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    // Load entities
    useEffect(() => { userId == 'new' || UserAPI.getUser(userId).then(setUser) }, [props])

    // Load values
    useEffect(() => { user && setEmail(user.email) }, [user])
    useEffect(() => { user && setName(user.name) }, [user])

    async function submit(event: FormEvent){
        event.preventDefault()
        if(userId == 'new') {
            if (name && email) {
                const user = await UserAPI.addUser({ name, email, password })
                history.replace(`/users/${user.id}`)
            }
        } else {
            if (name && email) {
                setUser(await UserAPI.updateUser(user.id, { name, email, password }))
            }
        }       
    }

    function encrypt(password: string): string {
        return hash.sha256().update(password).digest('hex')
    }

    async function reset() {
        history.goBack()
    }

    return (
        <div className="view user">
            { (userId == 'new' || user) && (
                <React.Fragment>
                    <header>
                        <nav>
                            <UserLink user={user}/>
                        </nav>
                    </header>
                    <main>
                        <div>
                            <h1>User editor</h1>
                            <form onSubmit={submit} onReset={reset} className='data-input'>
                                <TextInput label='Name' placeholder='Type name' value={name} change={setName}/>
                                <EmailInput label='Email' placeholder='Type email' value={email} change={setEmail}/>
                                <PasswordInput label='Password' placeholder='Type password' value={password} change={password => setPassword(encrypt(password))}/>
                                <div>
                                    <div/>
                                    <div>
                                        { userId == 'new' && <input type='reset' value='Cancel'/> } 
                                        <input type='submit' value='Save'/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </main>
                </React.Fragment>
            )}
        </div>
    )
    
}