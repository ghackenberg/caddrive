import { createContext } from 'react'
import { ProfileSchema } from '../schemas/profile.js'
import { Document } from '../services/firebase.js'

type ProfileContextProps = {
    contextProfile: Document<ProfileSchema>
}

export const ProfileContext = createContext<ProfileContextProps>(undefined)