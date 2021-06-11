import * as React from 'react'
import { Link } from 'react-router-dom'

export const Header = () => (
    <header>
        <Link to="/">
            <img src="/images/platform.png"/>
            Virtual Engineering Platform
        </Link>
    </header>
)