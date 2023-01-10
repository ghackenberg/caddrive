import * as React from 'react'

import { User } from 'productboard-common'

type UserContextProps = {
    contextUser: User & { permissions: string[] }
    setContextUser: (user: User & { permissions: string[] }) => void
}

export const UserContext = React.createContext<UserContextProps>(undefined)