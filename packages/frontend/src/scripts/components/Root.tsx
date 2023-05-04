import * as React from 'react'
import { Route, Switch, Redirect, useHistory, useLocation } from 'react-router-dom'

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
import { PageHeaderRoot } from './snippets/PageHeaderRoot'
import { LoadingView } from './views/Loading'
import { MissingView } from './views/Missing'

const AuthRouter = React.lazy(() => import('./routers/Auth'))
const LegalRouter = React.lazy(() => import('./routers/Legal'))
const ProductsRouter = React.lazy(() => import('./routers/Products'))
const UsersRouter = React.lazy(() => import('./routers/Users'))

const Root = () => {
    const { pathname } = useLocation()
    const { replace, push } = useHistory()

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
    const [initialized, setInitialized] = React.useState(false)

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
    React.useEffect(() => {
        if (contextUser !== undefined) {
            const path = pathname
            
            const legal1 = /^\/legal\/(.*)/.exec(path)
            const legal0 = /^\/legal/.exec(path)
            
            const auth1 = /^\/auth\/(.*)/.exec(path)
            const auth0 = /^\/auth/.exec(path)
            
            const users2 = /^\/users\/(.*)\/(.*)/.exec(path)
            const users1 = /^\/users\/(.*)/.exec(path)
            const users0 = /^\/users/.exec(path)
            
            const products4 = /^\/products\/(.*)\/(.*)\/(.*)\/(.*)/.exec(path)
            const products3 = /^\/products\/(.*)\/(.*)\/(.*)/.exec(path)
            const products2 = /^\/products\/(.*)\/(.*)/.exec(path)
            const products1 = /^\/products\/(.*)/.exec(path)

            if (legal1) {
                replace('/products')
                push(`/legal/${legal1[1]}`)
            } else if (legal0) {
                replace('/products')
                push('/legal')
            } else if (auth1) {
                replace('/products')
                push(`/auth/${auth1[1]}`)
            } else if (auth0) {
                replace('/products')
                push('/auth')
            } else if (users2) {
                replace('/products')
                push(`/users/${users2[1]}/${users2[2]}`)
            } else if (users1) {
                replace('/products')
                push(`/users/${users1[1]}`)
            } else if (users0) {
                replace('/products')
                push('/users')
            } else if (products4) {
                replace('/products')
                push(`/products/${products4[1]}/${products4[2]}`)
                push(`/products/${products4[1]}/${products4[2]}/${products4[3]}/${products4[4]}`)
            } else if (products3) {
                replace('/products')
                push(`/products/${products3[1]}/${products3[2]}`)
                push(`/products/${products3[1]}/${products3[2]}/${products3[3]}`)
            } else if (products2) {
                replace('/products')
                push(`/products/${products2[1]}/${products2[2]}`)
            } else if (products1) {
                replace('/products')
                push(`/products/${products1[1]}`)
            } else {
                replace('/products')
            }

            setInitialized(true)
        }
    }, [contextUser])

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
                    <PageHeaderRoot/>
                    {initialized ? (
                        <React.Suspense fallback={<LoadingView/>}>
                            <Switch>
                                <Route path="/legal" component={LegalRouter}/>
                                <Route path="/auth" component={AuthRouter}/>
                                <Route path="/users" component={UsersRouter}/>
                                <Route path="/products" component={ProductsRouter}/>
                                <Redirect path="/" exact to="/products" push={false}/>
                                <Route component={MissingView}/>
                            </Switch>
                        </React.Suspense>
                    ) : (
                        <LoadingView/>
                    )}
                </VersionContext.Provider>
            </UserContext.Provider>
        </AuthContext.Provider>
    )
}

export default Root