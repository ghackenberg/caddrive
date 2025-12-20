import { createContext } from 'react'
import { AccountSchema } from '../schemas/account.js'
import { Document } from '../services/firebase.js'

type AccountContextProps = {
    contextAccount: Document<AccountSchema>
}

export const AccountContext = createContext<AccountContextProps>(undefined)