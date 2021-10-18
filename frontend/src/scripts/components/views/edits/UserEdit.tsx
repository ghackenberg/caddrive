import  * as React from 'react'
import { useState, useEffect, Fragment, FormEvent } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
// Commons
import { User } from 'fhooe-audit-platform-common'
// Clients
import { UserAPI } from '../../../clients/rest'
// Snippets
import { Header } from '../../snippets/Header'
import { Navigation } from '../../snippets/Navigation'
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
                const user = await UserAPI.addUser({ name: name, email: email, password: encrypt(email, password) })
                history.replace(`/users/${user.id}`)
            }
        } else {
            if (name && email) {
                setUser(await UserAPI.updateUser({ id: user.id, name: name, email: email, password: encrypt(email, password)}))
            }
        }       
    }

    function encrypt(email: string, password: string) {
        var crypto = require('crypto-js');

        var algo = crypto.algo.SHA256.create()
        algo.update(password, 'utf-8')
        algo.update(crypto.SHA256(email), 'utf-8')
        var hash = algo.finalize().toString(crypto.enc.Base64)

        return hash
    }

    async function reset() {
        history.goBack()
    }

    return (
        <div className="view user">
            <Header/>
            <Navigation/>
            <main>
                { userId == 'new' || user ? (
                    <Fragment>
                        <nav>
                            <UserLink user={user}/>
                        </nav>
                        <h1>User editor</h1>
                        <h2>Property form</h2>
                        <form onSubmit={submit} onReset={reset}>
                            <TextInput label='Name' placeholder='Type name' value={name} change={setName}/>
                            <EmailInput label='Email' placeholder='Type email' value={email} change={setEmail}/>
                            <PasswordInput label='Password' placeholder='Type password' value={password} change={setPassword}/>
                            <div>
                                <div/>
                                <div>
                                    { userId == 'new' && <input type='reset' value='Cancel'/> } 
                                    <input type='submit' value='Save'/>
                                </div>
                            </div>
                        </form>
                    </Fragment>
                ) : (
                    <p>Loading...</p>
                )}
            </main>
        </div>
    )
    
}