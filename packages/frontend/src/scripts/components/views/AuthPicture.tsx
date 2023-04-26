import * as React from 'react'
import { useHistory } from 'react-router'

import { UserContext } from '../../contexts/User'
import { UserManager } from '../../managers/user'

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

    function handleSelect(event: React.UIEvent) {
        event.preventDefault()
        fileInput.current.click()
    }

    function handleCancel(event: React.UIEvent) {
        event.preventDefault()
        push('/auth/welcome')
    }

    return (
        <main className='view reduced auth'>
            <main>
                <div>
                    <h5>Authentication process</h5>
                    <h1>Step 5: Profile picture</h1>
                    <p>
                        Do you also want to upload a profile picture?
                        Profile pictures make collaboration more personal and more fun!
                    </p>
                    <div>
                        <input ref={fileInput} type="file" accept='.jpg' style={{display: 'none'}} onChange={handleChange}/>
                        <button className='button fill lightgray' onClick={handleCancel}>Skip</button>
                        <button className='button fill blue' onClick={handleSelect}>Select</button>
                    </div>
                    {!load && !error && <p style={{color: 'lightgray'}}>Waiting...</p>}
                    {load && <p style={{color: 'gray'}}>Loading...</p>}
                    {error && <p style={{color: 'red'}}>{error}</p>}
                </div>
            </main>
        </main>
    )
}