import * as React from 'react'

import { User } from 'productboard-common'

export const UserContext = React.createContext<User & {logout: () => void} & {update: (user: User) => void}>(undefined)