import * as React from 'react'

import { UserRead } from 'productboard-common'

type AuthContextProps = {
    authContextToken: string
    authContextUser: UserRead
    setAuthContextToken: (token: string) => void
    setAuthContextUser: (user: UserRead) => void
}

export const AuthContext = React.createContext<AuthContextProps>(undefined)