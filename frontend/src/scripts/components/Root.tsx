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
import { AuditListView } from './views/lists/AuditList'
import { EventListView } from './views/lists/EventList'
import { UserEditView } from './views/edits/UserEdit'
import { ProductEditView } from './views/edits/ProductEdit'
import { VersionEditView } from './views/edits/VersionEdit'
import { AuditEditView } from './views/edits/AuditEdit'
import { EventEditView } from './views/edits/EventEdit'
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
                            <Route path="/audits/:audit" component={AuditEditView}/>
                            <Route path="/audits" component={AuditListView}/>
                            {/* Event views */}
                            <Route path="/events/:event" component={EventEditView}/>
                            <Route path="/events" component={EventListView}/>
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