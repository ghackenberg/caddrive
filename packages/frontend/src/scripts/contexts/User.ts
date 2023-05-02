import * as React from 'react'

import { User } from 'productboard-common'

type UserContextProps = {
    contextUser: User
    setContextUser: (user: User) => void
}

export const UserContext = React.createContext<UserContextProps>(undefined)