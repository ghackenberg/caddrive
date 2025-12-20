import { Navigate, Route, Routes } from 'react-router'
import { UserHeader } from '../snippets/UserHeader.js'
import { UserSettingView } from '../views/UserSetting.js'

const UserRouter = () => {
    return (
        <>
            <UserHeader/>
            <Routes>
                <Route path="/:userId/settings" element={<UserSettingView/>}/>
                <Route path="/:userId" element={<Navigate replace to="/users/:userId/settings"/>}/>
            </Routes>
        </>
    )
}

export default UserRouter