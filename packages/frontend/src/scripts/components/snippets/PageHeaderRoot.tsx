import { Fragment, UIEvent, useContext } from 'react'
import { NavLink, Route, Routes } from 'react-router'
import { UserContext } from '../../contexts/User.js'
import { back } from '../../functions/history.js'
import { UserPictureWidget } from '../widgets/UserPicture.js'
import AppIcon from '/src/images/app.png'
import BackIcon from '/src/images/back.png'
import LoadIcon from '/src/images/load.png'

export const PageHeaderRoot = () => {

    const { contextUser } = useContext(UserContext)

    async function handleClick(event: UIEvent) {
        event.preventDefault()
        await back()
    }

    function Back() {
        return (
            <a onClick={handleClick}>
                <img src={BackIcon} className='icon small'/>
                <span>Back</span>
            </a>
        )
    }

    function Logo() {
        return (
            <NavLink to="/products" replace={true}>
                <img src={AppIcon} className='icon small'/>
                <span>CAD</span>
                <span>drive</span>
                <span>Your collaborative workspace for LDraw&trade; models</span>
            </NavLink>
        )
    }

    function User() {
        return (
            <>
                {contextUser === undefined && (
                    <a>
                        <img src={LoadIcon} className='icon small animation spin'/>
                    </a>
                )}
                {contextUser === null && (
                    <NavLink to='/auth/email' className='button fill white' style={{lineHeight: '100%'}}>
                        Sign up / in
                    </NavLink>
                )}
                {contextUser && (
                    <NavLink to={`/users/${contextUser.uid}/settings`}>
                        <UserPictureWidget userId={contextUser.uid} background='gray' class='icon small round'/>
                    </NavLink>
                )}
            </>
        )
    }

    return (
        <header className='page'>
            <div>
                <span>
                    <Routes>
                        <Route path="/legal" element={<Back/>}/>
                        <Route path="/auth" element={<Back/>}/>
                        <Route path="/users" element={<Back/>}/>
                        <Route path="/products/:productId" element={<Back/>}/>
                        <Route path="/*" element={<Logo/>}/>
                    </Routes>
                </span>
            </div>
            <div>
                <span>
                    <Routes>
                        <Route path="/legal" element={<Fragment/>}/>
                        <Route path="/auth" element={<Fragment/>}/>
                        <Route path="/*" element={<User/>}/>
                    </Routes>
                </span>
            </div>
        </header>
    )
    
}