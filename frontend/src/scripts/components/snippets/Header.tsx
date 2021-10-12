import * as React from 'react'
import { Link } from 'react-router-dom'
// Contexts
import { UserContext } from '../../contexts/User'
// Images
import * as PlatformIcon from '/src/images/platform.png'

export const Header = () => {

    const user = React.useContext(UserContext)

    return (
        <header>
            <Link to="/" onClick={user ? user.callback : () => {}}>
                <img src={PlatformIcon}/> FHO&Ouml; Virtual Engineering Platform
            </Link>
        </header>
    )

}