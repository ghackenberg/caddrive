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

    const [load, setLoad] = React.useState<boolean>(false)
    const [error, setError] = React.useState<string>()

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

    async function handleEmailSubmit(event: React.UIEvent) {
        try {
            event.preventDefault()
            setLoad(true)
            setError(undefined)
            const token = await TokenClient.createToken({ email })
            setId(token.id)
        } catch (e) {
            setError('Action failed.')
        } finally {
            setLoad(false)
        }
    }

    async function handleCodeSubmit(event: React.UIEvent) {
        try {
            event.preventDefault()
            setLoad(true)
            setError(undefined)
            const token = await TokenClient.activateToken(id, { code })
            localStorage.setItem('jwt', token.jwt)
            auth.headers.Authorization = `Bearer ${token.jwt}`
            setJWT(token.jwt)
        } catch (e) {
            setError('Action failed.')
            setLoad(false)
        }
    }

    return (
        <main className="view reduced user-auth">
            <main>
                    {id === undefined && (
                        <div>
                            <h5>Authentication process</h5>
                            <h1>Step 1: Email address</h1>
                            <p>
                                Please enter your <strong>email address</strong> and press <strong>next</strong>.
                                Then we will send you a <strong>verification code</strong> to sign up/in.
                            </p>
                            <div>
                                <input className='button fill lightgray' type="email" placeholder='Your email address' value={email} onKeyUp={event => event.key == 'Enter' && handleEmailSubmit(event)} onChange={event => setEmail(event.currentTarget.value)}/>
                                <button className='button fill blue' onClick={handleEmailSubmit} >Next</button>
                            </div>
                            {!load && !error && <p style={{color: 'lightgray'}}>Waiting...</p>}
                            {load && <p style={{color: 'gray'}}>Loading...</p>}
                            {error && <p style={{color: 'red'}}>{error}</p>}
                        </div>
                    )}
                    {id !== undefined && jwt === undefined && (
                        <div>
                            <h5>Authentication process</h5>
                            <h1>Step 2: Verification code</h1>
                            <p>
                                Please check your <strong>email inbox</strong>.
                                You should find your <strong>verification code</strong> there.
                                Then enter your code below and press <strong>next</strong>.
                            </p>
                            <div>
                                <input className='button fill lightgray' type="text" placeholder='Your verification code' minLength={6} maxLength={6} value={code} onKeyUp={event => event.key == 'Enter' && handleCodeSubmit(event)} onChange={event => setCode(event.currentTarget.value)}/>
                                <button className='button fill blue' onClick={handleCodeSubmit}>Next</button>
                            </div>
                            {!load && !error && <p style={{color: 'lightgray'}}>Waiting...</p>}
                            {load && <p style={{color: 'gray'}}>Loading...</p>}
                            {error && <p style={{color: 'red'}}>{error}</p>}
                        </div>
                    )}
                    {contextUser && (
                        <Redirect to='/'/>
                    )}
            </main>
        </main>
    )
}