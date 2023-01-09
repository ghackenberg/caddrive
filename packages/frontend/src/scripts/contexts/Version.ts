import * as React from 'react'

import { Version } from 'productboard-common'

export const VersionContext = React.createContext<Version & {update: (version: Version) => void}>(undefined)