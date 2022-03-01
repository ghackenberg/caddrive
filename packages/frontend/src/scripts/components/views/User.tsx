import  * as React from 'react'
import { useState, useEffect, FormEvent, Fragment } from 'react'
import { useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
import * as hash from 'hash.js'
// Commons
import { User } from 'productboard-common'
// Clients
import { UserAPI } from '../../clients/rest'
// Snippets
import { UserHeader } from '../snippets/UserHeader'
// Inputs
import { TextInput } from '../inputs/TextInput'
import { EmailInput } from '../inputs/EmailInput'
import { PasswordInput } from '../inputs/PasswordInput'
import { auth } from '../../clients/auth'
import { FileInput } from '../inputs/FileInput'

export const UserView = (props: RouteComponentProps<{ user: string }>) => {

    const userId = props.match.params.user
    
    const history = useHistory()

    // Define entities
    const [user, setUser] = useState<User>()

    // Define values
    const [email, setEmail] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [file, setFile] = useState<File>()

    // Load entities
    useEffect(() => { userId != 'new' && UserAPI.getUser(userId).then(setUser) }, [props])

    // Load values
    useEffect(() => { user && setEmail(user.email) }, [user])
    useEffect(() => { user && setName(user.name) }, [user])

    async function submit(event: FormEvent){
        event.preventDefault()
        if(userId == 'new') {
            if (name && email) {
                const user = await UserAPI.addUser({ name, email, password: encrypt(password) },file)
                history.replace(`/users/${user.id}`)
            }
        } else {
            if (name && email) {
                setUser(await UserAPI.updateUser(user.id, { name, email, password: encrypt(password) },file))
                if (auth.username == name) {
                    auth.password = encrypt(password)
                }
            }
        }       
    }

    function encrypt(password: string): string {
        return hash.sha256().update(password).digest('hex')
    }

    return (
        <main className="view extended user">
            { (userId == 'new' || user) && (
                <Fragment>
                    <UserHeader user={user}/>
                    <main>
                        <div>
                            <h1>Settings</h1>
                            <form onSubmit={submit}>
                                <TextInput label='Name' placeholder='Type name' value={name} change={setName}/>
                                <EmailInput label='Email' placeholder='Type email' value={email} change={setEmail}/>
                                <PasswordInput label='Password' placeholder='Type password' value={password} change={setPassword}/>
                                <FileInput label='File' placeholder='Select file' accept='.jpg' change={setFile}/>
                                <div>
                                    <div/>
                                    <div>
                                        <input type='submit' value='Save'/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </main>
                </Fragment>
            )}
        </main>
    )
    
}