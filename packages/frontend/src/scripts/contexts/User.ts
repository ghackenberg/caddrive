import { User } from 'firebase/auth'
import { createContext } from 'react'

type UserContextProps = {
    contextUser: User
}

export const UserContext = createContext<UserContextProps>(undefined)