import * as React from 'react'

import { User } from 'productboard-common'

export const UserContext = React.createContext<User & { permissions: string[] } & { update: (user: User & { permissions: string[] }) => void }>(undefined)