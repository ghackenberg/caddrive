import  * as React from 'react'
import { useState, useEffect, FormEvent, Fragment } from 'react'
import { Redirect, useHistory } from 'react-router'
import { RouteComponentProps } from 'react-router-dom'
import * as hash from 'hash.js'
// Commons
import { User } from 'productboard-common'
// Managers
import { UserManager } from '../../managers/user'
// Snippets
import { UserHeader } from '../snippets/UserHeader'
// Inputs
import { TextInput } from '../inputs/TextInput'
import { EmailInput } from '../inputs/EmailInput'
import { PasswordInput } from '../inputs/PasswordInput'
import { CheckboxInput } from '../inputs/CheckboxInput'
import { auth } from '../../clients/auth'
import { FileInput } from '../inputs/FileInput'

export const UserSettingView = (props: RouteComponentProps<{ user: string }>) => {
    
    const history = useHistory()
    
    // PARAMS

    const userId = props.match.params.user

    // STATES
    
    // - Entities
    const [user, setUser] = useState<User>()
    // - Values
    const [email, setEmail] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [userManagementPermission, setUserManagementPermission] = useState<boolean>(false)
    const [productManagementPermission, setProductManagementPermission] = useState<boolean>(false)
    const [file, setFile] = useState<File>()

    // EFFECTS

    // - Entities
    useEffect(() => { userId != 'new' && UserManager.getUser(userId).then(setUser) }, [props])
    // - Values
    useEffect(() => { user && setEmail(user.email) }, [user])
    useEffect(() => { user && setName(user.name) }, [user])
    useEffect(() => {user && setUserManagementPermission(user.userManagementPermission)}, [user])
    useEffect(() => {user && setProductManagementPermission(user.productManagementPermission)}, [user])

    // FUNCTIONS
    
    async function submit(event: FormEvent){
        event.preventDefault()
        if(userId == 'new') {
            if (name && email) {
                await UserManager.addUser({ name, email, password: encrypt(password), userManagementPermission, productManagementPermission },file)
            }
        } else {
            if (name && email) {
                await UserManager.updateUser(user.id, { name, email, password: password.length > 0 ? encrypt(password) : user.password, userManagementPermission, productManagementPermission },file)
                if (auth.username == name) {
                    auth.password = encrypt(password)
                }
            }
        }
        history.goBack()    
    }

    function encrypt(password: string): string {
        return hash.sha256().update(password).digest('hex')
    }

    // RETURN
        
    return (
        <main className="view extended user">
            { (userId == 'new' || user) && (
                <Fragment>
                    { user && user.deleted ? (
                        <Redirect to='/'/>
                    ) : (
                        <Fragment>
                            <UserHeader user={user}/>
                            <main>
                                <div>
                                    <h1>Settings</h1>
                                    <form onSubmit={submit}>
                                        <TextInput label='Name' placeholder='Type name' value={name} change={setName}/>
                                        <EmailInput label='Email' placeholder='Type email' value={email} change={setEmail}/>
                                        <PasswordInput label='Password' placeholder='Type password' value={password} change={setPassword} required = {userId === 'new'}/>
                                        <CheckboxInput label= 'User management permission' checked={userManagementPermission} change={setUserManagementPermission} />
                                        <CheckboxInput label= 'Product management permission' checked={productManagementPermission} change={setProductManagementPermission}/>
                                        <FileInput label='Picture' placeholder='Select .jpg file' accept='.jpg' change={setFile} required= {userId === 'new'}/>
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
                </Fragment>
            )}
        </main>
    )
}
