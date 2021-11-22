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
import { UserListView } from './views/lists/UserList'
import { ProductListView } from './views/lists/ProductList'
import { VersionListView } from './views/lists/VersionList'
import { UserEditView } from './views/edits/UserEdit'
import { ProductEditView } from './views/edits/ProductEdit'
import { VersionEditView } from './views/edits/VersionEdit'
import { IssueEditView } from './views/edits/IssueEdit'
import { IssueListView } from './views/lists/IssueList'
import { CommentEditView } from './views/edits/CommentEdit'
import { CommentListView } from './views/lists/CommentList'
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
                            <Route path="/users/:user" component={UserEditView}/>
                            <Route path="/users" component={UserListView}/>
                            {/* Product views */}
                            <Route path="/products/:product" component={ProductEditView}/>
                            <Route path="/products" component={ProductListView}/>
                            {/* Version views */}
                            <Route path="/versions/:version" component={VersionEditView}/>
                            <Route path="/versions" component={VersionListView}/>
                            {/* Audit views */}
                            <Route path="/issues/:issue" component={IssueEditView}/>
                            <Route path="/issues" component={IssueListView}/>
                            {/* Event views */}
                            <Route path="/comments/:comment" component={CommentEditView}/>
                            <Route path="/comments" component={CommentListView}/>
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