import * as React from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../../context'
import * as PlatformIcon from '/src/images/platform.png'

export const Header = () => {
    const user = React.useContext(UserContext)

    return (
        <header>
            <Link to="/" onClick={user ? user.callback : () => {}}>
                <img src={PlatformIcon}/> FHOOE Virtual Engineering Platform
            </Link>
        </header>
    )
}