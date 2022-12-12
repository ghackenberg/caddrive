import * as React from 'react'

import { Version } from 'productboard-common'

export const VersionContext = React.createContext<Version & {updateVersion: (version: Version) => void}>(undefined)