import * as React from 'react'
import { Link } from 'react-router-dom'
import * as PlatformIcon from '/src/images/platform.png'

export const Header = () => (
    <header>
        <Link to="/">
            <img src={PlatformIcon}/> FHOOE Virtual Engineering Platform
        </Link>
    </header>
)