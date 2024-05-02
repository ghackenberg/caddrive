import * as React from 'react'

import { VersionRead } from 'productboard-common'

type VersionContextProps = {
    contextVersion: VersionRead
    setContextVersion: (version: VersionRead) => void
}

export const VersionContext = React.createContext<VersionContextProps>(undefined)