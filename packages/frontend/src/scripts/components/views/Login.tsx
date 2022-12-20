import * as React from 'react'
import { useEffect} from 'react'

import { useAuth0 } from '@auth0/auth0-react'

import { auth } from '../../clients/auth'
import { UserManager } from '../../managers/user'
import { LoginButton } from '../inputs/LoginButton' //neu
import { LogoutButton } from '../inputs/LogoutButton' // neu
import { Profile } from '../inputs/Profile' // neu

export const LoginView = () => {

    // const contextUser = useContext(UserContext)
    // console.log(contextUser)

    const { isLoading, error } = useAuth0(); 
    const { user, isAuthenticated } = useAuth0();

    // STATES

    // EFFECTS
    
    // TODO: Derweil sind Calls nur möglich wenn man autentifiziert ist. Das ist aber noch nicht der Fall wenn man noch nicht eigelogged ist
    // Das hier muss später weg
    useEffect(() => { 
            auth.username = 'dominik.fruehwirth@fh-wels.at'
            auth.password = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
     }, [])

    // Test der API: einen User Per Mail aus dem Backend holen. true: User, false: undefined
    // -> Dann auf usestate
    useEffect(()=> {
        if (auth) {
            UserManager.getUserByMail('dominik.fruehwirth@fh-wels.at').then((res) => console.log(res))
        }
    },[auth])

    // RETURN

    return (
        <main className="view login">
            <main>
                <div>
                    {/* Neu */}
                    <h1>Auth0 Login</h1>
                    {error && <p>Authentication Error</p>}
                    {!error && isLoading && <p>Loading...</p>}
                    {!error && !isLoading && (
                        <>
                            <LoginButton />
                            <LogoutButton />
                            <Profile />
                        </>
                    )}
                    {isAuthenticated && (
                        <article className='column'>
                            {user?.picture && <img src={user.picture} alt={user?.name} />}
                            <h2>{user?.name}</h2>
                            <ul>
                                {Object.keys(user).map((objKey, i) => <li key={i}>{objKey}: {user[objKey]} </li>)}
                            </ul>
                        </article>
                    )}
                    {/* Neu */}

                </div>
            </main>
        </main>
    )

}