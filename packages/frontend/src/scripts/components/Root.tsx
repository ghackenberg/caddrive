import * as React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import { importJWK, JWK, jwtVerify, JWTVerifyResult, KeyLike} from 'jose'

import { User, Version } from 'productboard-common'

import { UserContext } from '../contexts/User'
import { VersionContext } from '../contexts/Version'
import { KeyManager } from '../managers/key'
import { UserManager } from '../managers/user'
import { PageHeader } from './snippets/PageHeader'
import { AuthView } from './views/Auth'
import { AuthConsentView } from './views/AuthConsent'
import { AuthNameView } from './views/AuthName'
import { AuthPictureView } from './views/AuthPicture'
import { AuthWelcomeView } from './views/AuthWelcome'
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

    // STATES

    const [publicJWK, setPublicJWK] = React.useState<JWK>()
    const [publicKey, setPublicKey] = React.useState<KeyLike | Uint8Array>()
    const [jwt] = React.useState<string>(localStorage.getItem('jwt'))
    const [jwtVerifyResult, setJWTVerifyResult] = React.useState<JWTVerifyResult>()
    const [payload, setPayload] = React.useState<{ userId: string }>()
    const [userId, setUserId] = React.useState<string>()
    const [contextUser, setContextUser] = React.useState<User>(jwt ? undefined : null)
    const [contextVersion, setContextVersion] = React.useState<Version>()

    // EFFECTS

    React.useEffect(() => {
        KeyManager.getPublicJWK().then(setPublicJWK).catch(() => setContextUser(null))
    }) 
    React.useEffect(() => {
        publicJWK && importJWK(publicJWK, "PS256").then(setPublicKey).catch(() => setContextUser(null))
    }, [publicJWK])
    React.useEffect(() => {
        jwt && publicKey && jwtVerify(jwt, publicKey).then(setJWTVerifyResult).catch(() => setContextUser(null))
    }, [jwt, publicKey])
    React.useEffect(() => {
        jwtVerifyResult && setPayload(jwtVerifyResult.payload as { userId: string })
    }, [jwtVerifyResult])
    React.useEffect(() => {
        payload && setUserId(payload.userId)
    }, [payload])
    React.useEffect(() => {
        userId && UserManager.getUser(userId).then(setContextUser).catch(() => setContextUser(null))
    }, [userId])

    // RETURN

    return (
        <UserContext.Provider value={{ contextUser, setContextUser }}>
            <VersionContext.Provider value={{ contextVersion, setContextVersion }}>
                <PageHeader/>
                {contextUser === undefined && (
                    <LoadingView/>
                )}
                {contextUser && contextUser.consent == null && (
                    <Switch>
                        <Route path="/auth/consent" component={AuthConsentView}/>
                        <Redirect to="/auth/consent"/>
                    </Switch>
                )}
                {contextUser && contextUser.consent != null && contextUser.name == null && (
                    <Switch>
                        <Route path="/auth/name" component={AuthNameView}/>
                        <Redirect to="/auth/name"/>
                    </Switch>
                )}
                {(contextUser === null || (contextUser && contextUser.consent != null && contextUser.name != null)) && (
                    <Switch>
                        {/* Auth views */}

                        <Route path="/auth/welcome" component={AuthWelcomeView}/>
                        <Route path="/auth/picture" component={AuthPictureView}/>
                        <Route path="/auth/name"><Redirect to="/auth/picture"/></Route>
                        <Route path="/auth/consent"><Redirect to="/auth/picture"/></Route>
                        <Route path="/auth" component={AuthView}/>

                        {/* User views */}

                        <Route path="/users/:user/settings" component={UserSettingView}/>
                        <Redirect path="/users/:user" to="/users/:user/settings"/>
                        <Route path="/users" component={UserView}/>

                        {/* Product views */}

                        <Route path="/products/:product/versions/:version/settings" component={ProductVersionSettingView}/>
                        <Redirect path="/products/:product/versions/:version" to="/products/:product/versions/:version/settings"/>
                        <Route path="/products/:product/versions" component={ProductVersionView}/>
                        
                        <Route path="/products/:product/issues/:issue/comments" component={ProductIssueCommentView}/>
                        <Route path="/products/:product/issues/:issue/settings" component={ProductIssueSettingView}/>
                        <Redirect path="/products/:product/issues/:issue" to="/products/:product/issues/:issue/comments"/>
                        <Route path="/products/:product/issues" component={ProductIssueView}/>

                        <Route path="/products/:product/milestones/:milestone/issues" component={ProductMilestoneIssueView}/>
                        <Route path="/products/:product/milestones/:milestone/settings" component={ProductMilestoneSettingView}/>
                        <Redirect path="/products/:product/milestones/:milestone" to="/products/:product/milestones/:milestone/issues"/>
                        <Route path="/products/:product/milestones" component={ProductMilestoneView}/>

                        <Route path="/products/:product/members/:member/settings" component={ProductMemberSettingView}/>
                        <Redirect path="/products/:product/members/:member" to="/products/:product/members/:member/settings"/>
                        <Route path="/products/:product/members" component={ProductMemberView}/>

                        <Route path="/products/:product/settings" component={ProductSettingView}/>
                        <Redirect path="/products/:product" to="/products/:product/versions"/>
                        <Route path="/products" component={ProductView}/>

                        <Redirect path="/" exact to="/products"/>

                        {/* Missing view */}
                        
                        <Route component={MissingView}/>
                    </Switch>
                )}
            </VersionContext.Provider>
        </UserContext.Provider>
    )

}