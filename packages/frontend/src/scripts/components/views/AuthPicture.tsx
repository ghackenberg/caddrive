import * as React from 'react'
import { Redirect, useHistory } from 'react-router'

import { UserContext } from '../../contexts/User'
import { UserManager } from '../../managers/user'

import AuthIcon from '/src/images/auth.png'

export const AuthPictureView = () => {
    const { push } = useHistory()

    // REFS

    const fileInput = React.createRef<HTMLInputElement>()

    // CONTEXTS

    const { contextUser, setContextUser } = React.useContext(UserContext)

    // STATES

    const [load, setLoad] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>()

    // FUNCTIONS

    async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (fileInput.current.files.length > 0) {
            try {
                event.preventDefault()
                setLoad(true)
                setError(undefined)
                const picture = fileInput.current.files[0]
                const user = await UserManager.updateUser(contextUser.id, { consent: contextUser.consent, name: contextUser.name }, picture)
                setContextUser(user)
                push('/auth/welcome')
            } catch (e) {
                setError('Action failed.')
                setLoad(false)
            }
        }
    }

    function handleUpload(event: React.UIEvent) {
        event.preventDefault()
        fileInput.current.click()
    }

    function handleSkip(event: React.UIEvent) {
        event.preventDefault()
        push('/auth/welcome')
    }

    return (
        contextUser ? (
            <main className='view reduced auth'>
                <main>
                    <div>
                        <div>
                            <img src={AuthIcon}/>
                            <h5>Authentication process</h5>
                            <h1>Step 5: <span>Profile picture</span></h1>
                            <p>
                                Do you also want to upload a profile picture?
                                Profile pictures make collaboration more personal and more fun!
                            </p>
                            <div>
                                <input ref={fileInput} type="file" accept='.jpg' style={{display: 'none'}} onChange={handleChange}/>
                                <button className='button fill lightgray' onClick={handleSkip}>Skip</button>
                                <button className='button fill blue' onClick={handleUpload}>
                                    {load ? 'Loading ...' : 'Upload'}
                                </button>
                            </div>
                            {error && <p style={{color: 'red'}}>{error}</p>}
                        </div>
                    </div>
                </main>
            </main>
        ) : (
            <Redirect to="/auth"/>
        )
    )
}