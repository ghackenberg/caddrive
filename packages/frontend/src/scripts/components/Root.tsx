import { importJWK, JWK, jwtVerify, JWTVerifyResult } from 'jose'
import { CommentRead, IssueRead, MemberRead, MilestoneRead, ProductRead, UserRead, VersionRead } from 'productboard-common'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { CacheAPI } from '../clients/cache.js'
import { MqttAPI } from '../clients/mqtt.js'
import { TokenClient } from '../clients/rest/token.js'
import { UserClient } from '../clients/rest/user.js'
import { AuthContext } from '../contexts/Auth.js'
import { CommentContext } from '../contexts/Comment.js'
import { IssueContext } from '../contexts/Issue.js'
import { MemberContext } from '../contexts/Member.js'
import { MilestoneContext } from '../contexts/Milestone.js'
import { ProductContext } from '../contexts/Product.js'
import { UserContext } from '../contexts/User.js'
import { VersionContext } from '../contexts/Version.js'
import { useAsyncHistory } from '../hooks/history.js'
import { AUTH_0, AUTH_1, PRODUCTS_1, PRODUCTS_2, PRODUCTS_3, PRODUCTS_4, PRODUCTS_5, PRODUCTS_6, USERS_0, USERS_1, USERS_2 } from '../pattern.js'
import { PageHeaderRoot } from './snippets/PageHeaderRoot.js'
import { LoadingView } from './views/Loading.js'
import { MissingView } from './views/Missing.js'

const AuthRouter = lazy(() => import('./routers/Auth.js'))
const ProductsRouter = lazy(() => import('./routers/Products.js'))
const UsersRouter = lazy(() => import('./routers/Users.js'))

const Root = () => {
    
    const { pathname } = useLocation()
    const { replace, push } = useAsyncHistory()

    // STATES

    const [publicJWK, setPublicJWK] = useState<JWK>()
    const [publicKey, setPublicKey] = useState<CryptoKey | Uint8Array>()
    const [jwt] = useState<string>(localStorage.getItem('jwt'))
    const [jwtVerifyResult, setJWTVerifyResult] = useState<JWTVerifyResult>()
    const [payload, setPayload] = useState<{ userId: string }>()
    const [userId, setUserId] = useState<string>()
    const [authContextToken, setAuthContextToken] = useState<string>()
    const [authContextUser, setAuthContextUser] = useState<UserRead>()
    const [contextUser, setContextUser] = useState<UserRead>(jwt ? undefined : null)
    const [contextProduct, setContextProduct] = useState<ProductRead>()
    const [contextMember, setContextMember] = useState<MemberRead>()
    const [contextVersion, setContextVersion] = useState<VersionRead>()
    const [contextIssue, setContextIssue] = useState<IssueRead>()
    const [contextComment, setContextComment] = useState<CommentRead>()
    const [contextMilestone, setContextMilestone] = useState<MilestoneRead>()
    const [initialized, setInitialized] = useState(false)

    // EFFECTS

    useEffect(() => {
        CacheAPI.loadPublicJWK().then(
            jwk => setPublicJWK(jwk)
        ).catch(
            () => setContextUser(null)
        )
    })

    useEffect(() => {
        publicJWK && importJWK(publicJWK, "PS256").then(
            key => setPublicKey(key)
        ).catch(
            () => setContextUser(null)
        )
    }, [publicJWK])

    useEffect(() => {
        jwt && publicKey && jwtVerify(jwt, publicKey).then(
            result => setJWTVerifyResult(result)
        ).catch(
            () => setContextUser(null)
        )
    }, [jwt, publicKey])

    useEffect(() => {
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

    useEffect(() => {
        payload && setUserId(payload.userId)
    }, [payload])

    useEffect(() => {
        userId && UserClient.getUser(userId).then(user => {
            setContextUser(user)
        }).catch(() => {
            setContextUser(null)
        })
    }, [userId])

    useEffect(() => {
        if (contextUser === undefined) return
        if (initialized) return

        const path = pathname
        
        const auth1 = AUTH_1.exec(path)
        const auth0 = AUTH_0.exec(path)
        
        const users2 = USERS_2.exec(path)
        const users1 = USERS_1.exec(path)
        const users0 = USERS_0.exec(path)
        
        const products6 = PRODUCTS_6.exec(path)
        const products5 = PRODUCTS_5.exec(path)
        const products4 = PRODUCTS_4.exec(path)
        const products3 = PRODUCTS_3.exec(path)
        const products2 = PRODUCTS_2.exec(path)
        const products1 = PRODUCTS_1.exec(path)

        if (auth1) {
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
        } else if (products6) {
            if (products6[4] == 'issues' && products6[5] != 'new' && products6[6] == 'settings') {
                replace('/products').
                    then(() => push(`/products/${products6[1]}/${products6[2]}`)).
                    then(() => push(`/products/${products6[1]}/${products6[2]}/${products6[3]}/${products6[4]}`)).
                    then(() => push(`/products/${products6[1]}/${products6[2]}/${products6[3]}/${products6[4]}/${products6[5]}/comments`)).
                    then(() => push(`/products/${products6[1]}/${products6[2]}/${products6[3]}/${products6[4]}/${products6[5]}/${products6[6]}`)).
                    then(() => setInitialized(true))
            } else {
                replace('/products').
                    then(() => push(`/products/${products6[1]}/${products6[2]}`)).
                    then(() => push(`/products/${products6[1]}/${products6[2]}/${products6[3]}/${products6[4]}`)).
                    then(() => push(`/products/${products6[1]}/${products6[2]}/${products6[3]}/${products6[4]}/${products6[5]}/${products6[6]}`)).
                    then(() => setInitialized(true))
            }
        } else if (products5) {
            replace('/products').
                then(() => push(`/products/${products5[1]}/${products5[2]}`)).
                then(() => push(`/products/${products5[1]}/${products5[2]}/${products5[3]}/${products5[4]}`)).
                then(() => push(`/products/${products5[1]}/${products5[2]}/${products5[3]}/${products5[4]}/${products5[5]}`)).
                then(() => setInitialized(true))
        } else if (products4) {
            if (products4[2] == 'issues' && products4[3] != 'new' && products4[4] == 'settings') {
                replace('/products').
                    then(() => push(`/products/${products4[1]}/${products4[2]}`)).
                    then(() => push(`/products/${products4[1]}/${products4[2]}/${products4[3]}/comments`)).
                    then(() => push(`/products/${products4[1]}/${products4[2]}/${products4[3]}/${products4[4]}`)).
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
    
    function intercept(newContextUser: UserRead) {
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
                                            <Suspense fallback={<LoadingView/>}>
                                                <Routes>
                                                    <Route path="/auth" element={<AuthRouter/>}/>
                                                    <Route path="/users" element={<UsersRouter/>}/>
                                                    <Route path="/products" element={<ProductsRouter/>}/>
                                                    <Route path="/" element={<Navigate replace to="/products"/>}/>
                                                    <Route element={<MissingView/>}/>
                                                </Routes>
                                            </Suspense>
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