import { User } from 'productboard-common'
import * as React from 'react'

export const UserContext = React.createContext<User & {logout: () => void} & {update: (user: User) => void}>(undefined)