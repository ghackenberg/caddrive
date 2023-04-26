import * as React from 'react'
import { Redirect } from 'react-router'

import { JWK, JWTVerifyResult, KeyLike, importJWK, jwtVerify } from 'jose'

import { auth } from '../../clients/auth'
import { TokenClient } from '../../clients/rest/token'
import { UserContext } from '../../contexts/User'
import { KeyManager } from '../../managers/key'
import { UserManager } from '../../managers/user'

export const UserAuthView = () => {
    // CONTEXTS

    const { contextUser, setContextUser } = React.useContext(UserContext)

    // STATES

    const [publicJWK, setPublicJWK] = React.useState<JWK>()
    const [publicKey, setPublicKey] = React.useState<KeyLike | Uint8Array>()
    const [jwtVerifyResult, setJWTVerifyResult] = React.useState<JWTVerifyResult>()
    const [payload, setPayload] = React.useState<{ userId: string }>()
    const [userId, setUserId] = React.useState<string>()

    const [email, setEmail] = React.useState<string>('')
    const [id, setId] = React.useState<string>()
    const [code, setCode] = React.useState<string>('')
    const [jwt, setJWT] = React.useState<string>()

    // EFFECTS

    React.useEffect(() => {
        !contextUser && KeyManager.getPublicJWK().then(setPublicJWK)
    }) 
    React.useEffect(() => {
        !contextUser && publicJWK && importJWK(publicJWK, "PS256").then(setPublicKey)
    }, [publicJWK])
    React.useEffect(() => {
        !contextUser && jwt && publicKey && jwtVerify(jwt, publicKey).then(setJWTVerifyResult)
    }, [jwt, publicKey])
    React.useEffect(() => {
        !contextUser && jwtVerifyResult && setPayload(jwtVerifyResult.payload as { userId: string })
    }, [jwtVerifyResult])
    React.useEffect(() => {
        !contextUser && payload && setUserId(payload.userId)
    }, [payload])
    React.useEffect(() => {
        !contextUser && userId && UserManager.getUser(userId).then(setContextUser)
    }, [userId])

    // EVENTS

    async function handleEmailSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const token = await TokenClient.createToken({ email })
        setId(token.id)
    }
    async function handleCodeSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const token = await TokenClient.activateToken(id, { code })
        localStorage.setItem('jwt', token.jwt)
        auth.headers.Authorization = `Bearer ${token.jwt}`
        setJWT(token.jwt)
    }

    return (
        <main className="view reduced user-auth">
            <main>
                <div>
                    <h1>Sign up/in</h1>
                    {id === undefined && (
                        <form onSubmit={handleEmailSubmit}>
                            <label>Email: </label>
                            <input type="email" value={email} onChange={event => setEmail(event.currentTarget.value)}/>
                            <input type="submit"/>
                        </form>
                    )}
                    {id !== undefined && jwt === undefined && (
                        <form onSubmit={handleCodeSubmit}>
                            <label>Code: </label>
                            <input type="text" minLength={6} maxLength={6} value={code} onChange={event => setCode(event.currentTarget.value)}/>
                            <input type="submit"/>
                        </form>
                    )}
                    {contextUser && (
                        <Redirect to='/'/>
                    )}
                </div>
            </main>
        </main>
    )
}