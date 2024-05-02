import * as React from 'react'

import { User } from 'productboard-common'

type AuthContextProps = {
    authContextToken: string
    authContextUser: User
    setAuthContextToken: (token: string) => void
    setAuthContextUser: (user: User) => void
}

export const AuthContext = React.createContext<AuthContextProps>(undefined)