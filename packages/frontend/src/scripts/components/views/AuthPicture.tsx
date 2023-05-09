import * as React from 'react'
import { Redirect } from 'react-router'

import { AuthContext } from '../../contexts/Auth'
import { useAsyncHistory } from '../../hooks/history'
import { UserManager } from '../../managers/user'
import { LegalFooter } from '../snippets/LegalFooter'

import AuthIcon from '/src/images/auth.png'

export const AuthPictureView = () => {

    const { push } = useAsyncHistory()

    // REFS

    const fileInput = React.createRef<HTMLInputElement>()

    // CONTEXTS

    const { authContextUser, setAuthContextUser } = React.useContext(AuthContext)

    // STATES

    const [load, setLoad] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>()

    // FUNCTIONS

    async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        // TODO handle unmount!
        if (fileInput.current.files.length > 0) {
            try {
                event.preventDefault()
                setLoad(true)
                setError(undefined)
                const picture = fileInput.current.files[0]
                const user = await UserManager.updateUser(authContextUser.id, { consent: authContextUser.consent, name: authContextUser.name }, picture)
                setAuthContextUser(user)
                await push('/auth/welcome')
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

    async function handleSkip(event: React.UIEvent) {
        event.preventDefault()
        await push('/auth/welcome')
    }

    return (
        authContextUser ? (
            <main className='view auth picture'>
                <div>
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
                    <LegalFooter/>
                </div>
            </main>
        ) : (
            <Redirect to="/auth"/>
        )
    )
}