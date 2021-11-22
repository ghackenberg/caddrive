import * as React from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
// Commons
import { User } from 'fhooe-audit-platform-common'
// Clients
import { auth } from '../clients/auth'
// Contexts
import { UserContext } from '../contexts/User'
// Views
import { LoginView } from './views/Login'
import { HomeView } from './views/Home'
import { UserView } from './views/User'
import { UsersView } from './views/Users'
import { IssueView } from './views/Issue'
import { IssuesView } from './views/Issues'
import { VersionView } from './views/Version'
import { VersionsView } from './views/Versions'
import { ProductView } from './views/Product'
import { ProductsView } from './views/Products'
// Images
import * as ProductIcon from '/src/images/product.png'

export const Root = () => {

    const [user, setUser] = React.useState<User>()

    function callback() {
        localStorage.removeItem('username')
        localStorage.removeItem('password')

        auth.username = undefined
        auth.password = undefined

        setUser(undefined)
    }
    
    return (
        <React.Fragment>
            <Helmet>
                <link rel="icon" href={ProductIcon}/>
            </Helmet>
            <BrowserRouter>
                {user ? (
                    <UserContext.Provider value={{callback, ...user}}>
                        <Switch>
                            {/* User views */}
                            <Route path="/users/:user" component={UserView}/>
                            <Route path="/users" component={UsersView}/>
                            {/* Issue views */}
                            <Route path="/products/:product/issues/:issue" component={IssueView}/>
                            <Route path="/products/:product/issues" component={IssuesView}/>
                            {/* Version views */}
                            <Route path="/products/:product/versions/:version" component={VersionView}/>
                            <Route path="/products/:product/versions" component={VersionsView}/>
                            {/* Product views */}
                            <Route path="/products/:product" component={ProductView}/>
                            <Route path="/products" component={ProductsView}/>
                            {/* Home view */}
                            <Route component={HomeView}/>
                        </Switch>
                    </UserContext.Provider>
                ) : (
                    <LoginView callback={setUser}/>
                )}
            </BrowserRouter>
        </React.Fragment>
    )

}