import { VersionRead } from 'productboard-common'
import { createContext } from 'react'

type VersionContextProps = {
    contextVersion: VersionRead
    setContextVersion: (version: VersionRead) => void
}

export const VersionContext = createContext<VersionContextProps>(undefined)