import { JWK, JWTVerifyResult, importJWK, jwtVerify } from 'jose'
import { createRef, useContext, useEffect, useState } from 'react'
import { auth } from '../../clients/auth.js'
import { CacheAPI } from '../../clients/cache.js'
import { TokenClient } from '../../clients/rest/token.js'
import { UserClient } from '../../clients/rest/user.js'
import { AuthContext } from '../../contexts/Auth.js'
import { go, replaceState } from '../../functions/history.js'
import { LegalFooter } from '../snippets/LegalFooter.js'
import AuthIcon from '/src/images/auth.png'

export const AuthCodeView = () => {

    // REFS

    const inputRef = createRef<HTMLInputElement>()

    // CONTEXTS

    const { authContextToken, setAuthContextUser } = useContext(AuthContext)

    // STATES

    const [publicJWK, setPublicJWK] = useState<JWK>()
    const [publicKey, setPublicKey] = useState<CryptoKey | Uint8Array>()
    const [jwtVerifyResult, setJWTVerifyResult] = useState<JWTVerifyResult>()
    const [payload, setPayload] = useState<{ userId: string }>()
    const [userId, setUserId] = useState<string>()

    const [code, setCode] = useState<string>('')
    const [jwt, setJWT] = useState<string>()

    const [load, setLoad] = useState<boolean>(false)
    const [error, setError] = useState<string>()

    // EFFECTS

    useEffect(() => {
        inputRef.current.focus()
    })

    useEffect(() => {
        let exec = true
        CacheAPI.loadPublicJWK().then(publicJWK => exec && setPublicJWK(publicJWK))
        return () => { exec = false }
    })

    useEffect(() => {
        let exec = true
        publicJWK && importJWK(publicJWK, "PS256").then(publicKey => exec && setPublicKey(publicKey))
        return () => { exec = false }
    }, [publicJWK])

    useEffect(() => {
        let exec = true
        jwt && publicKey && jwtVerify(jwt, publicKey).then(jwtVerifyResult => exec && setJWTVerifyResult(jwtVerifyResult))
        return () => { exec = false }
    }, [jwt, publicKey])

    useEffect(() => {
        jwtVerifyResult && setPayload(jwtVerifyResult.payload as { userId: string })
    }, [jwtVerifyResult])
    
    useEffect(() => {
        payload && setUserId(payload.userId)
    }, [payload])

    useEffect(() => {
        let exec = true
        if (userId) {
            setLoad(true)
            setError(undefined)
            UserClient.getUser(userId).then(async user => {
                if (exec) {
                    if (!user.consent || !user.name) {
                        setAuthContextUser(user)
                        setLoad(false)
                        await replaceState('/auth/consent')
                    } else {
                        setLoad(false)
                        await go(-2)
                    }
                }
            }).catch(() => {
                setError('Action failed.')
                setLoad(false)
            })
        }
        return () => { exec = false }
    }, [userId])

    // EVENTS

    async function handleSubmit(event: React.UIEvent) {
        // TODO handle unmount!
        try {
            event.preventDefault()
            setLoad(true)
            setError(undefined)
            const token = await TokenClient.activateToken(authContextToken, { code })
            localStorage.setItem('jwt', token.jwt)
            auth.headers.Authorization = `Bearer ${token.jwt}`
            setJWT(token.jwt)
            setLoad(false)
        } catch (e) {
            setError('Action failed.')
            setLoad(false)
        }
    }

    return (
        <main className="view auth code">
            <div>
                <div className='main center'>
                    <div>
                        <img src={AuthIcon}/>
                        <h5>Authentication process</h5>
                        <h1>Step 2: <span>Verification code</span></h1>
                        <p>
                            Please check your <strong>email inbox</strong>.
                            You should find your <strong>verification code</strong> there.
                            Then enter your code below and press <strong>next</strong>.
                        </p>
                        <div>
                            <input ref={inputRef} className='button fill lightgray' type="text" placeholder='Your verification code' minLength={6} maxLength={6} value={code} onKeyUp={event => event.key == 'Enter' && handleSubmit(event)} onChange={event => setCode(event.currentTarget.value)}/>
                            <button className='button fill red' onClick={handleSubmit}>
                                {load ? 'Loading ...' : 'Next'}
                            </button>
                        </div>
                        {error && <p style={{color: 'var(--red)'}}>{error}</p>}
                    </div>
                </div>
                <LegalFooter/>
            </div>
        </main>
    )
}