import { UserRead } from 'productboard-common'
import { createContext } from 'react'

type UserContextProps = {
    contextUser: UserRead
    setContextUser: (user: UserRead) => void
}

export const UserContext = createContext<UserContextProps>(undefined)