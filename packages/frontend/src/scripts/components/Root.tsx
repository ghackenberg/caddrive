import * as React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import { importJWK, JWK, jwtVerify, JWTVerifyResult, KeyLike} from 'jose'

import { User, Version } from 'productboard-common'

import { TokenClient } from '../clients/rest/token'
import { AuthContext } from '../contexts/Auth'
import { UserContext } from '../contexts/User'
import { VersionContext } from '../contexts/Version'
import { CommentManager } from '../managers/comment'
import { FileManager } from '../managers/file'
import { IssueManager } from '../managers/issue'
import { KeyManager } from '../managers/key'
import { MemberManager } from '../managers/member'
import { MilestoneManager } from '../managers/milestone'
import { ProductManager } from '../managers/product'
import { UserManager } from '../managers/user'
import { VersionManager } from '../managers/version'
import { PageHeader } from './snippets/PageHeader'
import { LoadingView } from './views/Loading'
import { MissingView } from './views/Missing'

const AuthRouter = React.lazy(() => import('./routers/Auth'))
const LegalRouter = React.lazy(() => import('./routers/Legal'))
const ProductRouter = React.lazy(() => import('./routers/Product'))
const UserRouter = React.lazy(() => import('./routers/User'))

const Root = () => {
    // STATES

    const [publicJWK, setPublicJWK] = React.useState<JWK>()
    const [publicKey, setPublicKey] = React.useState<KeyLike | Uint8Array>()
    const [jwt] = React.useState<string>(localStorage.getItem('jwt'))
    const [jwtVerifyResult, setJWTVerifyResult] = React.useState<JWTVerifyResult>()
    const [payload, setPayload] = React.useState<{ userId: string }>()
    const [userId, setUserId] = React.useState<string>()
    const [authContextToken, setAuthContextToken] = React.useState<string>()
    const [authContextUser, setAuthContextUser] = React.useState<User>()
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
        if (jwtVerifyResult) {
            setPayload(jwtVerifyResult.payload as { userId: string })
            TokenClient.refreshToken().then(token => localStorage.setItem('jwt', token.jwt))
        }
    }, [jwtVerifyResult])
    React.useEffect(() => {
        payload && setUserId(payload.userId)
    }, [payload])
    React.useEffect(() => {
        userId && UserManager.getUser(userId).then(setContextUser).catch(() => setContextUser(null))
    }, [userId])

    // FUNCTIONS
    
    function intercept(newContextUser: User) {
        if (contextUser && newContextUser) {
            if (contextUser.id != newContextUser.id) {
                clear()
            }
        } else if (contextUser) {
            clear()
        } else if (newContextUser) {
            clear()
        }
        setContextUser(newContextUser)
    }
    function clear() {
        UserManager.clear()
        ProductManager.clear()
        VersionManager.clear()
        IssueManager.clear()
        CommentManager.clear()
        MilestoneManager.clear()
        MemberManager.clear()
        FileManager.clear()
    }

    // RETURN

    return (
        <AuthContext.Provider value={{ authContextToken, setAuthContextToken, authContextUser, setAuthContextUser }}>
            <UserContext.Provider value={{ contextUser, setContextUser: intercept }}>
                <VersionContext.Provider value={{ contextVersion, setContextVersion }}>
                    <PageHeader/>
                    {contextUser === undefined ? (
                        <LoadingView/>
                    ) : (
                        <React.Suspense fallback={<LoadingView/>}>
                            <Switch>
                                <Route path="/legal*" component={LegalRouter}/>
                                <Route path="/auth*" component={AuthRouter}/>
                                <Route path="/users*" component={UserRouter}/>
                                <Route path="/products*" component={ProductRouter}/>
                                <Redirect path="/" exact to="/products"/>
                                <Route component={MissingView}/>
                            </Switch>
                        </React.Suspense>
                    )}
                </VersionContext.Provider>
            </UserContext.Provider>
        </AuthContext.Provider>
    )
}

export default Root