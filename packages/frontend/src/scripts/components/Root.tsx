import * as React from 'react'
import { Route, Switch, Redirect, useLocation } from 'react-router-dom'

import { importJWK, JWK, jwtVerify, JWTVerifyResult, KeyLike } from 'jose'

import { Comment, Issue, Member, Milestone, Product, User, Version } from 'productboard-common'

import { PageHeaderRoot } from './snippets/PageHeaderRoot'
import { LoadingView } from './views/Loading'
import { MissingView } from './views/Missing'
import { CacheAPI } from '../clients/cache'
import { MqttAPI } from '../clients/mqtt'
import { TokenClient } from '../clients/rest/token'
import { UserClient } from '../clients/rest/user'
import { AuthContext } from '../contexts/Auth'
import { CommentContext } from '../contexts/Comment'
import { IssueContext } from '../contexts/Issue'
import { MemberContext } from '../contexts/Member'
import { MilestoneContext } from '../contexts/Milestone'
import { ProductContext } from '../contexts/Product'
import { UserContext } from '../contexts/User'
import { VersionContext } from '../contexts/Version'
import { useAsyncHistory } from '../hooks/history'
import { AUTH_0, AUTH_1, LEGAL_0, LEGAL_1, PRODUCTS_1, PRODUCTS_2, PRODUCTS_3, PRODUCTS_4, USERS_0, USERS_1, USERS_2 } from '../pattern'

const AuthRouter = React.lazy(() => import('./routers/Auth'))
const LegalRouter = React.lazy(() => import('./routers/Legal'))
const ProductsRouter = React.lazy(() => import('./routers/Products'))
const UsersRouter = React.lazy(() => import('./routers/Users'))

const Root = () => {
    
    const { pathname } = useLocation()
    const { replace, push } = useAsyncHistory()

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
    const [contextProduct, setContextProduct] = React.useState<Product>()
    const [contextMember, setContextMember] = React.useState<Member>()
    const [contextVersion, setContextVersion] = React.useState<Version>()
    const [contextIssue, setContextIssue] = React.useState<Issue>()
    const [contextComment, setContextComment] = React.useState<Comment>()
    const [contextMilestone, setContextMilestone] = React.useState<Milestone>()
    const [initialized, setInitialized] = React.useState(false)

    // EFFECTS

    React.useEffect(() => {
        CacheAPI.loadPublicJWK().then(
            jwk => setPublicJWK(jwk)
        ).catch(
            () => setContextUser(null)
        )
    })

    React.useEffect(() => {
        publicJWK && importJWK(publicJWK, "PS256").then(
            key => setPublicKey(key)
        ).catch(
            () => setContextUser(null)
        )
    }, [publicJWK])

    React.useEffect(() => {
        jwt && publicKey && jwtVerify(jwt, publicKey).then(
            result => setJWTVerifyResult(result)
        ).catch(
            () => setContextUser(null)
        )
    }, [jwt, publicKey])

    React.useEffect(() => {
        if (jwtVerifyResult) {
            // Extract payload
            setPayload(jwtVerifyResult.payload as { userId: string })
            // Refresh local storage
            TokenClient.refreshToken().then(
                token => localStorage.setItem('jwt', token.jwt)
            ).catch(
                () => setContextUser(null)
            )
        }
    }, [jwtVerifyResult])

    React.useEffect(() => {
        payload && setUserId(payload.userId)
    }, [payload])

    React.useEffect(() => {
        userId && UserClient.getUser(userId).then(user => {
            setContextUser(user)
        }).catch(() => {
            setContextUser(null)
        })
    }, [userId])

    React.useEffect(() => {
        if (contextUser === undefined) return
        if (initialized) return

        const path = pathname
        
        const legal1 = LEGAL_1.exec(path)
        const legal0 = LEGAL_0.exec(path)
        
        const auth1 = AUTH_1.exec(path)
        const auth0 = AUTH_0.exec(path)
        
        const users2 = USERS_2.exec(path)
        const users1 = USERS_1.exec(path)
        const users0 = USERS_0.exec(path)
        
        const products4 = PRODUCTS_4.exec(path)
        const products3 = PRODUCTS_3.exec(path)
        const products2 = PRODUCTS_2.exec(path)
        const products1 = PRODUCTS_1.exec(path)

        if (legal1) {
            replace('/products').
                then(() => push(`/legal/${legal1[1]}`)).
                then(() => setInitialized(true))
        } else if (legal0) {
            replace('/products').
                then(() => push('/legal')).
                then(() => setInitialized(true))
        } else if (auth1) {
            replace('/products').
                then(() => push(`/auth/email`)).
                then(() => setInitialized(true))
        } else if (auth0) {
            replace('/products').
                then(() => push('/auth')).
                then(() => setInitialized(true))
        } else if (users2) {
            replace('/products').
                then(() => push(`/users/${users2[1]}/${users2[2]}`)).
                then(() => setInitialized(true))
        } else if (users1) {
            replace('/products').
                then(() => push(`/users/${users1[1]}`)).
                then(() => setInitialized(true))
        } else if (users0) {
            replace('/products').
                then(() => push('/users')).
                then(() => setInitialized(true))
        } else if (products4) {
            if (products4[2] == 'issues' && products4[3] != 'new' && products4[4] == 'settings') {
                replace('/products').
                    then(() => push(`/products/${products4[1]}/${products4[2]}`)).
                    then(() => push(`/products/${products4[1]}/${products4[2]}/${products4[3]}/comments`)).
                    then(() => push(`/products/${products4[1]}/${products4[2]}/${products4[3]}/settings`)).
                    then(() => setInitialized(true))
            } else if (products4[2] == 'milestones' && products4[3] != 'new' && products4[4] == 'settings') {
                replace('/products').
                    then(() => push(`/products/${products4[1]}/${products4[2]}`)).
                    then(() => push(`/products/${products4[1]}/${products4[2]}/${products4[3]}/issues`)).
                    then(() => push(`/products/${products4[1]}/${products4[2]}/${products4[3]}/settings`)).
                    then(() => setInitialized(true))
            } else {
                replace('/products').
                    then(() => push(`/products/${products4[1]}/${products4[2]}`)).
                    then(() => push(`/products/${products4[1]}/${products4[2]}/${products4[3]}/${products4[4]}`)).
                    then(() => setInitialized(true))
            }
        } else if (products3) {
            replace('/products').
                then(() => push(`/products/${products3[1]}/${products3[2]}`)).
                then(() => push(`/products/${products3[1]}/${products3[2]}/${products3[3]}`)).
                then(() => setInitialized(true))
        } else if (products2) {
            replace('/products').
                then(() => push(`/products/${products2[1]}/${products2[2]}`)).
                then(() => setInitialized(true))
        } else if (products1) {
            replace('/products').
                then(() => push(`/products/${products1[1]}`)).
                then(() => setInitialized(true))
        } else {
            replace('/products').
                then(() => setInitialized(true))
        }
    }, [contextUser])

    // FUNCTIONS
    
    function intercept(newContextUser: User) {
        if (contextUser && newContextUser) {
            if (contextUser.userId != newContextUser.userId) {
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
        // TODO check order!
        CacheAPI.clear()
        MqttAPI.clear()
    }

    // RETURN

    return (
        <AuthContext.Provider value={{ authContextToken, setAuthContextToken, authContextUser, setAuthContextUser }}>
            <UserContext.Provider value={{ contextUser, setContextUser: intercept }}>
                <ProductContext.Provider value={{ contextProduct, setContextProduct }}>
                    <MemberContext.Provider value={{ contextMember, setContextMember }}>
                        <VersionContext.Provider value={{ contextVersion, setContextVersion }}>
                            <IssueContext.Provider value={{ contextIssue, setContextIssue }}>
                                <CommentContext.Provider value={{ contextComment, setContextComment }}>
                                    <MilestoneContext.Provider value={{ contextMilestone, setContextMilestone }}>
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
                                    </MilestoneContext.Provider>
                                </CommentContext.Provider>
                            </IssueContext.Provider>
                        </VersionContext.Provider>
                    </MemberContext.Provider>
                </ProductContext.Provider>
            </UserContext.Provider>
        </AuthContext.Provider>
    )
}

export default Root