import * as React from 'react'
// Commons
import { User } from 'fhooe-audit-platform-common'

export const UserContext = React.createContext<User & {callback: () => void}>(undefined)