import * as React from 'react'

import { Version } from 'productboard-common'

type VersionContextProps = {
    contextVersion: Version
    setContextVersion: (version: Version) => void
}

export const VersionContext = React.createContext<VersionContextProps>(undefined)