import { Navigate, Route, Routes } from 'react-router'
import { AuthCodeView } from '../views/AuthCode.js'
import { AuthConsentView } from '../views/AuthConsent.js'
import { AuthDownloadView } from '../views/AuthDownload.js'
import { AuthEmailView } from '../views/AuthEmail.js'
import { AuthNameView } from '../views/AuthName.js'
import { AuthPictureView } from '../views/AuthPicture.js'
import { AuthWelcomeView } from '../views/AuthWelcome.js'

const AuthRouter = () => {
    return (
        <Routes>
            <Route path="/email" element={<AuthEmailView/>}/>
            <Route path="/code" element={<AuthCodeView/>}/>
            <Route path="/consent" element={<AuthConsentView/>}/>
            <Route path="/name" element={<AuthNameView/>}/>
            <Route path="/picture" element={<AuthPictureView/>}/>
            <Route path="/download" element={<AuthDownloadView/>}/>
            <Route path="/welcome" element={<AuthWelcomeView/>}/>
            <Route path="/" element={<Navigate replace to="/auth/email"/>}/>
        </Routes>
    )
}

export default AuthRouter