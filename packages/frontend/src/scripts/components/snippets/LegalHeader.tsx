import * as React from 'react'
import { NavLink } from 'react-router-dom'

import LegalIcon from '/src/images/legal.png'

export const LegalHeader = () => {
    return (
        <header className='view legal'>
            <div className='tabs'>
                <span>
                    <NavLink to="/legal/terms" replace={true}>
                        <img src={LegalIcon}  className='icon small'/>
                        <span>Terms</span>
                    </NavLink>
                </span>
                <span>
                    <NavLink to="/legal/privacy" replace={true}>
                        <img src={LegalIcon}  className='icon small'/>
                        <span>Privacy</span>
                    </NavLink>
                </span>
                <span>
                    <NavLink to="/legal/imprint" replace={true}>
                        <img src={LegalIcon}  className='icon small'/>
                        <span>Imprint</span>
                    </NavLink>
                </span>
            </div>
        </header>
    )
}