import * as React from 'react'
import { NavLink } from 'react-router-dom'

export const LegalFooter = (props: { replace?: boolean }) => {
    const replace = props.replace || false
    return (
        <div className='footer'>
            <span>&copy; 2023 FHOOE</span>
            <a href="https://caddrive.org" target="_blank">About</a>
            <NavLink to="/legal/terms" replace={replace}>Terms</NavLink>
            <NavLink to="/legal/privacy" replace={replace}>Privacy</NavLink>
            <NavLink to="/legal/imprint" replace={replace}>Imprint</NavLink>
        </div>
    )
}