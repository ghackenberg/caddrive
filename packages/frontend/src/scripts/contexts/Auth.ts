import { UserRead } from 'productboard-common'
import { createContext } from 'react'

type AuthContextProps = {
    authContextToken: string
    authContextUser: UserRead
    setAuthContextToken: (token: string) => void
    setAuthContextUser: (user: UserRead) => void
}

export const AuthContext = createContext<AuthContextProps>(undefined)