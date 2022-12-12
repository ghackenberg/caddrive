import * as React from 'react'
import { Helmet } from 'react-helmet'
import { BrowserRouter, Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom'

import { User, Version } from 'productboard-common'

import { auth } from '../clients/auth'
import { UserContext } from '../contexts/User'
import { VersionContext } from '../contexts/ProductVersion'
import { PageHeader } from './snippets/PageHeader'
import { LoginView } from './views/Login'
import { ProductView } from './views/Product'
import { ProductIssueView } from './views/ProductIssue'
import { ProductIssueCommentView } from './views/ProductIssueComment'
import { ProductIssueSettingView } from './views/ProductIssueSetting'
import { ProductMemberView } from './views/ProductMember'
import { ProductMemberSettingView } from './views/ProductMemberSetting'
import { ProductMilestoneView } from './views/ProductMilestone'
import { ProductMilestoneIssueView } from './views/ProductMilestoneIssue'
import { ProductMilestoneSettingView } from './views/ProductMilestoneSetting'
import { ProductSettingView } from './views/ProductSetting'
import { ProductVersionView } from './views/ProductVersion'
import { ProductVersionSettingView } from './views/ProductVersionSetting'
import { MissingView } from './views/Missing'
import { UserView } from './views/User'
import { UserSettingView } from './views/UserSetting'

import * as AppIcon from '/src/images/app.png'

export const Root = () => {

    // STATES

    const [user, setUser] = React.useState<User>()
    const [Version, setVersion] = React.useState<Version>()

    // FUNCTIONS

    function logout() {
        localStorage.removeItem('username')
        localStorage.removeItem('password')

        auth.username = undefined
        auth.password = undefined

        setUser(undefined)
    }

    function update(user: User) {
        localStorage.setItem('username', user.email)
        localStorage.setItem('password', user.password)

        auth.username = user.email
        auth.password = user.password

        setUser(user)
    }

    function updateVersion(version: Version) {
        setVersion(version)
    }

    // RETURN
    
    return (
        <React.Fragment>
            <Helmet>
                <link rel="icon" href={AppIcon}/>
            </Helmet>
            <BrowserRouter>
                <UserContext.Provider value={{logout, update, ...user}}>
                    <VersionContext.Provider value={{updateVersion, ...Version}}>
                        <PageHeader/>
                        {user ? (
                            <Switch>
                                {/* User views */}
                                <Route path="/users/:user/settings" render={(props: RouteComponentProps<{ user: string }>) => user.userManagementPermission || user.email == auth.username ? <UserSettingView {...props}/> : <MissingView/>}/>
                                <Route path="/users" render={() => user.userManagementPermission ? <UserView/> : <MissingView/>}/>

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
                                <Route path="/products/:product/settings" render={(props: RouteComponentProps<{ product: string }>) => user.productManagementPermission || props.match.params.product != 'new' ? <ProductSettingView {...props}/> : <MissingView/>}/>
                                {/* <Route path="/products/:product/settings" component={ProductSettingView}/> */}
                                <Route path="/products" component={ProductView}/>

                                {/* Home view */}
                                <Redirect to="/products"/>
                            </Switch>
                        ) : (
                            <LoginView/>
                            )}
                        </VersionContext.Provider>
                </UserContext.Provider>
            </BrowserRouter>
        </React.Fragment>
    )

}