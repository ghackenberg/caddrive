import { useContext } from 'react'
import { Navigate } from 'react-router'
import { AuthContext } from '../../contexts/Auth.js'
import { push } from '../../functions/history.js'
import { DESKTOP, LINUX, MAC, WINDOWS } from '../../platform.js'
import { LegalFooter } from '../snippets/LegalFooter.js'
import AuthIcon from '/src/images/auth.png'

export const AuthDownloadView = () => {

    // CONTEXTS

    const { authContextUser } = useContext(AuthContext)

    // FUNCTIONS

    async function handleDownload(event: React.UIEvent) {
        event.preventDefault()
        if (WINDOWS) {
            window.open('https://www.leocad.org/', '_blank') // TODO Download URL
        } else if (MAC) {            
            window.open('https://www.leocad.org/', '_blank') // TODO Download URL
        } else if (LINUX) {
            window.open('https://www.leocad.org/', '_blank') // TODO Download URL
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
                                <button className='button fill red' onClick={handleDownload}>Download</button>
                            </div>
                        </div>
                    </div>
                    <LegalFooter/>
                </div>
            </main>
        ) : (
            <Navigate to="/auth"/>
        )
    )
}