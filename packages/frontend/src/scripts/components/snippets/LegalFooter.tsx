import * as React from 'react'
import { NavLink } from 'react-router-dom'

export const LegalFooter = () => {
    return (
        <div>
            <span>&copy; 2023 FHOOE</span>
            <NavLink to="/legal/imprint">Imprint</NavLink>
            <NavLink to="/legal/terms">Terms of use</NavLink>
            <NavLink to="/legal/privacy">Privacy policy</NavLink>
        </div>
    )
}