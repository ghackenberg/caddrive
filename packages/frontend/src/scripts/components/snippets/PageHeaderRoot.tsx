import * as React from 'react'
import { useContext } from 'react'
import { NavLink, Route, Switch, useHistory } from 'react-router-dom'

import { UserContext } from '../../contexts/User'
import { UserPictureWidget } from '../widgets/UserPicture'

import AppIcon from '/src/images/app.png'
import LoadIcon from '/src/images/load.png'

export const PageHeaderRoot = () => {

    const { goBack } = useHistory()

    const { contextUser } = useContext(UserContext)

    function handleClick(event: React.UIEvent) {
        event.preventDefault()
        goBack()
    }

    return (
        <header className='page'>
            <div>
                <span>
                    <Switch>
                        <Route path="/legal">
                            <a onClick={handleClick}>
                                <img src={AppIcon} className='icon small'/>
                                <span>Product</span>
                                <span>Board</span>
                            </a>
                        </Route>
                        <Route path="/auth">
                            <a onClick={handleClick}>
                                <img src={AppIcon} className='icon small'/>
                                <span>Product</span>
                                <span>Board</span>
                            </a>
                        </Route>
                        <Route>
                            <NavLink to="/products">
                                <img src={AppIcon} className='icon small'/>
                                <span>Product</span>
                                <span>Board</span>
                            </NavLink>
                        </Route>
                    </Switch>
                </span>
            </div>
            <div>
                <span>
                    <Switch>
                        <Route path="/legal">

                        </Route>
                        <Route path="/auth">

                        </Route>
                        <Route>
                            {contextUser === undefined && (
                                <a>
                                    <img src={LoadIcon} className='icon small animation spin'/>
                                </a>
                            )}
                            {contextUser === null && (
                                <NavLink to='/auth' className='button fill white' style={{lineHeight: '100%'}}>
                                    Sign up / in
                                </NavLink>
                            )}
                            {contextUser && (
                                <NavLink to={`/users/${contextUser.id}/settings`}>
                                    <UserPictureWidget user={contextUser} background='gray' class='icon small round'/>
                                </NavLink>
                            )}
                        </Route>
                    </Switch>
                </span>
            </div>
        </header>
    )
    
}