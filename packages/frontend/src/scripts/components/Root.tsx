import * as React from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter, Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom'
// Commons
import { User } from 'productboard-common'
// Clients
import { auth } from '../clients/auth'
// Contexts
import { UserContext } from '../contexts/User'
// Snippets
import { PageHeader } from './snippets/PageHeader'
// Views
import { LoginView } from './views/Login'
import { UserView } from './views/User'
import { UsersView } from './views/Users'
import { IssueView } from './views/Issue'
import { IssuesView } from './views/Issues'
import { VersionView } from './views/Version'
import { VersionsView } from './views/Versions'
import { MembersView } from './views/Members'
import { MemberView } from './views/Member'
import { ProductView } from './views/Product'
import { ProductsView } from './views/Products'
import { MilestonesView } from './views/Milestones'
// Images
import * as AppIcon from '/src/images/app.png'
import { CommentsView } from './views/Comments'

export const Root = () => {

    // STATES

    const [user, setUser] = React.useState<User>()

    // FUNCTIONS

    function callback() {
        localStorage.removeItem('username')
        localStorage.removeItem('password')

        auth.username = undefined
        auth.password = undefined

        setUser(undefined)
    }

    // RETURN
    
    return (
        <React.Fragment>
            <Helmet>
                <link rel="icon" href={AppIcon}/>
            </Helmet>
            <BrowserRouter>
                <PageHeader/>
                {user ? (
                    <UserContext.Provider value={{callback, ...user}}>
                        <Switch>
                            {/* User views */}
                            <Route path="/users/:user/settings" component={UserView}/>
                            <Route path="/users/:user" render={(props: RouteComponentProps<{user: string}>) => <Redirect to={`/users/${props.match.params.user}/settings`}/>}/>
                            <Route path="/users" component={UsersView}/>
                            {/* Product views */}
                            <Route path="/products/:product/versions/:version" component={VersionView}/>
                            <Route path="/products/:product/versions" component={VersionsView}/>
                            <Route path="/products/:product/issues/:issue/comments" component={CommentsView}/>
                            <Route path="/products/:product/issues/:issue" component={IssueView}/>
                            <Route path="/products/:product/issues" component={IssuesView}/>
                            <Route path="/products/:product/members/:member" component={MemberView}/>
                            <Route path="/products/:product/members" component={MembersView}/>
                            <Route path="/products/:product/milestones" component={MilestonesView}/>
                            <Route path="/products/:product/settings" component={ProductView}/>
                            <Route path="/products/:product" render={(props: RouteComponentProps<{product: string}>) => <Redirect to={`/products/${props.match.params.product}/versions`}/>}/>
                            <Route path="/products" component={ProductsView}/>
                            {/* Home view */}
                            <Redirect to="/products"/>
                        </Switch>
                    </UserContext.Provider>
                ) : (
                    <LoginView callback={setUser}/>
                )}
            </BrowserRouter>
        </React.Fragment>
    )

}