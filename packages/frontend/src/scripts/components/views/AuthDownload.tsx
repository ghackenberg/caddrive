import * as React from 'react'
import { Redirect } from 'react-router'

import { DESKTOP, LINUX, MAC, WINDOWS } from '../../platform'
import { AuthContext } from '../../contexts/Auth'
import { useAsyncHistory } from '../../hooks/history'
import { LegalFooter } from '../snippets/LegalFooter'

import AuthIcon from '/src/images/auth.png'

export const AuthDownloadView = () => {

    const { push } = useAsyncHistory()

    // CONTEXTS

    const { authContextUser } = React.useContext(AuthContext)

    // FUNCTIONS

    async function handleDownload(event: React.UIEvent) {
        event.preventDefault()
        if (WINDOWS) {
            window.open('https://todo/', '_blank') // TODO Download URL
        } else if (MAC) {            
            window.open('https://todo/', '_blank') // TODO Download URL
        } else if (LINUX) {
            window.open('https://todo/', '_blank') // TODO Download URL
        } else {
            alert('We do not support your platform yet!')
        }
        await push('/auth/welcome')
    }

    async function handleSkip(event: React.UIEvent) {
        event.preventDefault()
        await push('/auth/welcome')
    }

    return (
        authContextUser && DESKTOP ? (
            <main className='view auth download'>
                <div>
                    <div className='main center'>
                        <div>
                            <img src={AuthIcon}/>
                            <h5>Authentication process</h5>
                            <h1>Step 6: <span>Desktop tool</span></h1>
                            <p>
                                You want to create your <strong>own LDraw&trade; models</strong>?
                                We suggest using <strong>LeoCAD with CADdrive</strong> for desktop!
                            </p>
                            <div>
                                <button className='button fill lightgray' onClick={handleSkip}>Skip</button>
                                <button className='button fill blue' onClick={handleDownload}>Download</button>
                            </div>
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