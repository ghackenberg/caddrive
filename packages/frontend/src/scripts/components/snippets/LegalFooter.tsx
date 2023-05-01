import * as React from 'react'
import { NavLink } from 'react-router-dom'

export const LegalFooter = (props: { replace?: boolean }) => {
    const replace = props.replace || false
    return (
        <div>
            <span>&copy; 2023 FHOOE</span>
            <NavLink to="/legal/imprint" replace={replace}>Imprint</NavLink>
            <NavLink to="/legal/terms" replace={replace}>Terms of use</NavLink>
            <NavLink to="/legal/privacy" replace={replace}>Privacy policy</NavLink>
        </div>
    )
}