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
            <Route path="/users/:userId" element={<UserRouter/>}/>
            <Route path="/users" element={<Overview/>}/>
        </Routes>
    )
}

export default UsersRouter