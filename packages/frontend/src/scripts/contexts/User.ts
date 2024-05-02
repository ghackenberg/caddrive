import * as React from 'react'

import { UserRead } from 'productboard-common'

type UserContextProps = {
    contextUser: UserRead
    setContextUser: (user: UserRead) => void
}

export const UserContext = React.createContext<UserContextProps>(undefined)