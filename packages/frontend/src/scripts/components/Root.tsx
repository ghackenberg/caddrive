import * as React from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
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
import { UserSettingView } from './views/UserSetting'
import { ProductView } from './views/Product'
import { ProductVersionView } from './views/ProductVersion'
import { ProductVersionSettingView } from './views/ProductVersionSetting'
import { ProductIssueView } from './views/ProductIssue'
import { ProductIssueSettingView } from './views/ProductIssueSetting'
import { ProductIssueCommentView } from './views/ProductIssueComment'
import { ProductMilestoneView } from './views/ProductMilestone'
import { ProductMilestoneSettingView } from './views/ProductMilestoneSetting'
import { ProductMilestoneIssueView } from './views/ProductMilestoneIssue'
import { ProductMemberView } from './views/ProductMember'
import { ProductMemberSettingView } from './views/ProductMemberSetting'
import { ProductSettingView } from './views/ProductSetting'
// Images
import * as AppIcon from '/src/images/app.png'

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
                            <Route path="/users/:user/settings" component={UserSettingView}/>
                            <Route path="/users" component={UserView}/>

                            {/* Version views */}
                            <Route path="/products/:product/versions/:version/settings" component={ProductVersionSettingView}/>
                            <Route path="/products/:product/versions" component={ProductVersionView}/>

                            {/* Issue views */}
                            <Route path="/products/:product/issues/:issue/comments" component={ProductIssueCommentView}/>
                            <Route path="/products/:product/issues/:issue/settings" component={ProductIssueSettingView}/>
                            <Route path="/products/:product/issues" component={ProductIssueView}/>

                            {/* Milestone views */}
                            <Route path="/products/:product/milestones/:milestone/issues" component={ProductMilestoneIssueView}/>
                            <Route path="/products/:product/milestones/:milestone/settings" component={ProductMilestoneSettingView}/>
                            <Route path="/products/:product/milestones" component={ProductMilestoneView}/>

                            {/* Member views */}
                            <Route path="/products/:product/members/:member/settings" component={ProductMemberSettingView}/>
                            <Route path="/products/:product/members" component={ProductMemberView}/>

                            {/* Product views */}
                            <Route path="/products/:product/settings" component={ProductSettingView}/>
                            <Route path="/products" component={ProductView}/>

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