import * as React from 'react'
import { NavLink, Route, Switch } from 'react-router-dom'

import LegalIcon from '/src/images/legal.png'

export const LegalHeader = () => {
    return (
        <header className='view large legal'>
            <div>
                <span>
                    <NavLink to="/legal" replace={true}>
                        <img src={LegalIcon} className='icon small'/>
                        <span>Legal</span>
                    </NavLink>
                </span>
                <span>
                    <Switch>
                        <Route path="/legal/imprint">
                            <NavLink to="/legal/imprint">
                                <span>Imprint</span>
                            </NavLink>
                        </Route>
                        <Route path="/legal/terms">
                            <NavLink to="/legal/terms" replace={true}>
                                <span>Terms of use</span>
                            </NavLink>
                        </Route>
                        <Route path="/legal/privacy">
                            <NavLink to="/legal/privacy" replace={true}>
                                <span>Privacy policy</span>
                            </NavLink>
                        </Route>
                    </Switch>
                </span>
            </div>
            <div>
                <span>
                    <NavLink to="/legal/imprint" replace={true}>
                        <img src={LegalIcon}  className='icon small'/>
                        <span>Imprint</span>
                    </NavLink>
                </span>
                <span>
                    <NavLink to="/legal/terms" replace={true}>
                        <img src={LegalIcon}  className='icon small'/>
                        <span>Terms of use</span>
                    </NavLink>
                </span>
                <span>
                    <NavLink to="/legal/privacy" replace={true}>
                        <img src={LegalIcon}  className='icon small'/>
                        <span>Privacy policy</span>
                    </NavLink>
                </span>
            </div>
        </header>
    )
}