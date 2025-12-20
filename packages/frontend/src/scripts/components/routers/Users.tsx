import { lazy } from 'react'
import { Route, Routes } from 'react-router'
import { UsersHeader } from '../snippets/UsersHeader.js'
import { UserView } from '../views/User.js'

const UserRouter = lazy(() => import('./User.js'))

const Overview = () => (
    <>
        <UsersHeader/>
        <UserView/>
    </>
)

const UsersRouter = () => {
    return (
        <Routes>
            <Route path="/:userId/*" element={<UserRouter/>}/>
            <Route path="/" element={<Overview/>}/>
        </Routes>
    )
}

export default UsersRouter