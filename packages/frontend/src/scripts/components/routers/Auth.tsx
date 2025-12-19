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
            <Route path="/auth/email" element={<AuthEmailView/>}/>
            <Route path="/auth/code" element={<AuthCodeView/>}/>
            <Route path="/auth/consent" element={<AuthConsentView/>}/>
            <Route path="/auth/name" element={<AuthNameView/>}/>
            <Route path="/auth/picture" element={<AuthPictureView/>}/>
            <Route path="/auth/download" element={<AuthDownloadView/>}/>
            <Route path="/auth/welcome" element={<AuthWelcomeView/>}/>
            <Route path="/auth" element={<Navigate replace to="/auth/email"/>}/>
        </Routes>
    )
}

export default AuthRouter