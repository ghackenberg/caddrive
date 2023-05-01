import * as React from 'react'
import { NavLink, Route, Switch } from 'react-router-dom'

import LegalIcon from '/src/images/legal.png'

export const LegalHeader = () => {
    return (
        <header className='view large legal'>
            <div>
                <span>
                    <NavLink to="/legal">
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
                            <NavLink to="/legal/terms">
                                <span>Terms of use</span>
                            </NavLink>
                        </Route>
                        <Route path="/legal/privacy">
                            <NavLink to="/legal/privacy">
                                <span>Privacy policy</span>
                            </NavLink>
                        </Route>
                    </Switch>
                </span>
            </div>
            <div>
                <span>
                    <NavLink to="/legal/imprint">
                        <img src={LegalIcon}  className='icon small'/>
                        <span>Imprint</span>
                    </NavLink>
                </span>
                <span>
                    <NavLink to="/legal/terms">
                        <img src={LegalIcon}  className='icon small'/>
                        <span>Terms of use</span>
                    </NavLink>
                </span>
                <span>
                    <NavLink to="/legal/privacy">
                        <img src={LegalIcon}  className='icon small'/>
                        <span>Privacy policy</span>
                    </NavLink>
                </span>
            </div>
        </header>
    )
}