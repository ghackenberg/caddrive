import { onAuthStateChanged, User } from 'firebase/auth'
import { CommentRead, IssueRead, MemberRead, MilestoneRead, ProductRead, VersionRead } from 'productboard-common'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import { AccountContext } from '../contexts/Account.js'
import { CommentContext } from '../contexts/Comment.js'
import { IssueContext } from '../contexts/Issue.js'
import { MemberContext } from '../contexts/Member.js'
import { MilestoneContext } from '../contexts/Milestone.js'
import { ProductContext } from '../contexts/Product.js'
import { ProfileContext } from '../contexts/Profile.js'
import { UserContext } from '../contexts/User.js'
import { VersionContext } from '../contexts/Version.js'
import { pushState, replaceState } from '../functions/history.js'
import { AUTH_0, AUTH_1, PRODUCTS_1, PRODUCTS_2, PRODUCTS_3, PRODUCTS_4, PRODUCTS_5, PRODUCTS_6, USERS_0, USERS_1, USERS_2 } from '../pattern.js'
import { AccountSchema } from '../schemas/account.js'
import { ProfileSchema } from '../schemas/profile.js'
import { auth, Document, onAccount, onProfile } from '../services/firebase.js'
import { PageHeaderRoot } from './snippets/PageHeaderRoot.js'
import { LoadingView } from './views/Loading.js'
import { MissingView } from './views/Missing.js'

const AuthRouter = lazy(() => import('./routers/Auth.js'))
const ProductsRouter = lazy(() => import('./routers/Products.js'))
const UsersRouter = lazy(() => import('./routers/Users.js'))

const Root = () => {
    
    const { pathname } = useLocation()

    // STATES

    const [contextUser, setContextUser] = useState<User>()
    const [contextAccount, setContextAccount] = useState<Document<AccountSchema>>()
    const [contextProfile, setContextProfile] = useState<Document<ProfileSchema>>()
    const [contextProduct, setContextProduct] = useState<ProductRead>()
    const [contextMember, setContextMember] = useState<MemberRead>()
    const [contextVersion, setContextVersion] = useState<VersionRead>()
    const [contextIssue, setContextIssue] = useState<IssueRead>()
    const [contextComment, setContextComment] = useState<CommentRead>()
    const [contextMilestone, setContextMilestone] = useState<MilestoneRead>()
    const [initialized, setInitialized] = useState(false)

    // EFFECTS

    useEffect(() => {
        return onAuthStateChanged(auth, setContextUser)
    }, [])

    useEffect(() => {
        if (contextUser) {
            return onAccount(contextUser.uid, setContextAccount)
        } else {
            return setContextAccount(undefined)
        }
    }, [contextUser])

    useEffect(() => {
        if (contextUser) {
            return onProfile(contextUser.uid, setContextProfile)
        } else {
            return setContextProfile(undefined)
        }
    }, [contextUser])

    useEffect(() => {
        if (contextUser === undefined || initialized) return

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
            replaceState('/products').
                then(() => pushState(`/auth/email`)).
                then(() => setInitialized(true))
        } else if (auth0) {
            replaceState('/products').
                then(() => pushState('/auth')).
                then(() => setInitialized(true))
        } else if (users2) {
            replaceState('/products').
                then(() => pushState(`/users/${users2[1]}/${users2[2]}`)).
                then(() => setInitialized(true))
        } else if (users1) {
            replaceState('/products').
                then(() => pushState(`/users/${users1[1]}`)).
                then(() => setInitialized(true))
        } else if (users0) {
            replaceState('/products').
                then(() => pushState('/users')).
                then(() => setInitialized(true))
        } else if (products6) {
            if (products6[4] == 'issues' && products6[5] != 'new' && products6[6] == 'settings') {
                replaceState('/products').
                    then(() => pushState(`/products/${products6[1]}/${products6[2]}`)).
                    then(() => pushState(`/products/${products6[1]}/${products6[2]}/${products6[3]}/${products6[4]}`)).
                    then(() => pushState(`/products/${products6[1]}/${products6[2]}/${products6[3]}/${products6[4]}/${products6[5]}/comments`)).
                    then(() => pushState(`/products/${products6[1]}/${products6[2]}/${products6[3]}/${products6[4]}/${products6[5]}/${products6[6]}`)).
                    then(() => setInitialized(true))
            } else {
                replaceState('/products').
                    then(() => pushState(`/products/${products6[1]}/${products6[2]}`)).
                    then(() => pushState(`/products/${products6[1]}/${products6[2]}/${products6[3]}/${products6[4]}`)).
                    then(() => pushState(`/products/${products6[1]}/${products6[2]}/${products6[3]}/${products6[4]}/${products6[5]}/${products6[6]}`)).
                    then(() => setInitialized(true))
            }
        } else if (products5) {
            replaceState('/products').
                then(() => pushState(`/products/${products5[1]}/${products5[2]}`)).
                then(() => pushState(`/products/${products5[1]}/${products5[2]}/${products5[3]}/${products5[4]}`)).
                then(() => pushState(`/products/${products5[1]}/${products5[2]}/${products5[3]}/${products5[4]}/${products5[5]}`)).
                then(() => setInitialized(true))
        } else if (products4) {
            if (products4[2] == 'issues' && products4[3] != 'new' && products4[4] == 'settings') {
                replaceState('/products').
                    then(() => pushState(`/products/${products4[1]}/${products4[2]}`)).
                    then(() => pushState(`/products/${products4[1]}/${products4[2]}/${products4[3]}/comments`)).
                    then(() => pushState(`/products/${products4[1]}/${products4[2]}/${products4[3]}/${products4[4]}`)).
                    then(() => setInitialized(true))
            } else {
                replaceState('/products').
                    then(() => pushState(`/products/${products4[1]}/${products4[2]}`)).
                    then(() => pushState(`/products/${products4[1]}/${products4[2]}/${products4[3]}/${products4[4]}`)).
                    then(() => setInitialized(true))
            }
        } else if (products3) {
            replaceState('/products').
                then(() => pushState(`/products/${products3[1]}/${products3[2]}`)).
                then(() => pushState(`/products/${products3[1]}/${products3[2]}/${products3[3]}`)).
                then(() => setInitialized(true))
        } else if (products2) {
            replaceState('/products').
                then(() => pushState(`/products/${products2[1]}/${products2[2]}`)).
                then(() => setInitialized(true))
        } else if (products1) {
            replaceState('/products').
                then(() => pushState(`/products/${products1[1]}`)).
                then(() => setInitialized(true))
        } else {
            replaceState('/products').
                then(() => setInitialized(true))
        }
    }, [contextUser])

    console.log(contextUser, contextAccount, contextProfile, initialized)

    // RETURN

    return (
        <UserContext.Provider value={{ contextUser }}>
            <AccountContext.Provider value={{ contextAccount }}>
                <ProfileContext.Provider value={{ contextProfile }}>
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
                                                        <Route path="/auth/*" element={<AuthRouter/>}/>
                                                        <Route path="/users/*" element={<UsersRouter/>}/>
                                                        <Route path="/products/*" element={<ProductsRouter/>}/>
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
                </ProfileContext.Provider>
            </AccountContext.Provider>
        </UserContext.Provider>
    )
}

export default Root