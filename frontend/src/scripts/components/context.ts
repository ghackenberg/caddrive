import { User } from 'fhooe-audit-platform-common'
import * as React from 'react'

export const UserContext = React.createContext<User & {callback: () => void}>(undefined)