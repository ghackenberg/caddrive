import * as React from 'react'
// Commons
import { User } from 'productboard-common'

export const UserContext = React.createContext<User & {callback: () => void}>(undefined)