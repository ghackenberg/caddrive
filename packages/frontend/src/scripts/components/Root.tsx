import * as React from 'react'
import { Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom'

import { useAuth0 } from '@auth0/auth0-react'
import * as jose from 'jose'

import { User, Version } from 'productboard-common'

import { auth } from '../clients/auth'
import { UserContext } from '../contexts/User'
import { VersionContext } from '../contexts/Version'
import { AUTH0_AUDIENCE } from '../env'
import { UserManager } from '../managers/user'
import { PageHeader } from './snippets/PageHeader'
import { LandingView } from './views/Landing'
import { LoadingView } from './views/Loading'
import { MissingView } from './views/Missing'
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
import { UserView } from './views/User'
import { UserSettingView } from './views/UserSetting'

import '/src/styles/root.css'

export const Root = () => {

    const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0()

    // STATES

    const [accessToken, setAccessToken] = React.useState<string>()

    const [contextUser, setContextUser] = React.useState<User & { permissions: string[] }>()
    const [contextVersion, setContextVersion] = React.useState<Version>()

    // EFFECTS

    React.useEffect(() => {
        if (user) {
            getAccessTokenSilently({ audience: AUTH0_AUDIENCE }).then(setAccessToken)
        } else {
            setAccessToken(undefined)
        }
    }, [user])
    
    React.useEffect(() => {
        if (accessToken) {
            auth.headers.Authorization = `Bearer ${accessToken}`
            UserManager.getUser(user.sub.split('|')[1]).then(userData => {
                const { permissions } = jose.decodeJwt(accessToken) as { permissions: string[] }
                setContextUser({ ...userData, permissions })
            })
        } else {
            auth.headers.Authorization = ''
            setContextUser(undefined)
        }
    }, [accessToken])

    // RETURN

    return (
        <UserContext.Provider value={{ contextUser, setContextUser }}>
            <VersionContext.Provider value={{ contextVersion, setContextVersion }}>
                <PageHeader/>
                {isLoading ? (
                    <LoadingView/>
                ) : (
                    <>
                        {isAuthenticated ? (
                            <>
                                {contextUser && (
                                    <Switch>
                                        {/* User views */}

                                        <Route path="/users/:user/settings" render={(props: RouteComponentProps<{ user: string }>) => contextUser.permissions.includes('create:users') || contextUser.email == user.email ? <UserSettingView {...props}/> : <MissingView/>} />
                                        <Redirect path="/users/:user" to="/users/:user/settings"/>
                                        <Route path="/users" render={() => contextUser.permissions.includes('create:users') ? <UserView/> : <MissingView/>} />
            
                                        {/* Product views */}

                                        <Route path="/products/:product/versions/:version/settings" component={ProductVersionSettingView} />
                                        <Redirect path="/products/:product/versions/:version" to="/products/:product/versions/:version/settings"/>
                                        <Route path="/products/:product/versions" component={ProductVersionView} />
                                        
                                        <Route path="/products/:product/issues/:issue/comments" component={ProductIssueCommentView} />
                                        <Route path="/products/:product/issues/:issue/settings" component={ProductIssueSettingView} />
                                        <Redirect path="/products/:product/issues/:issue" to="/products/:product/issues/:issue/comments" />
                                        <Route path="/products/:product/issues" component={ProductIssueView} />

                                        <Route path="/products/:product/milestones/:milestone/issues" component={ProductMilestoneIssueView} />
                                        <Route path="/products/:product/milestones/:milestone/settings" component={ProductMilestoneSettingView} />
                                        <Redirect path="/products/:product/milestones/:milestone" to="/products/:product/milestones/:milestone/issues" />
                                        <Route path="/products/:product/milestones" component={ProductMilestoneView} />

                                        <Route path="/products/:product/members/:member/settings" component={ProductMemberSettingView} />
                                        <Redirect path="/products/:product/members/:member" to="/products/:product/members/:member/settings" />
                                        <Route path="/products/:product/members" component={ProductMemberView} />

                                        <Route path="/products/:product/settings" render={(props: RouteComponentProps<{ product: string }>) => contextUser.permissions.includes('create:products') || props.match.params.product != 'new' ? <ProductSettingView {...props}/> : <MissingView/>} />
                                        <Redirect path="/products/:product" to="/products/:product/versions" />
                                        <Route path="/products" component={ProductView} />
            
                                        {/* Home view */}

                                        <Redirect to="/products"/>
                                    </Switch>
                                )}
                            </>
                        ) : (
                            <LandingView/>
                        )}
                    </>
                )}
            </VersionContext.Provider>
        </UserContext.Provider>
    )

}