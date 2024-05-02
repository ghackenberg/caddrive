import * as React from 'react'

import { MilestoneRead } from 'productboard-common'

type MilestoneContextProps = {
    contextMilestone: MilestoneRead
    setContextMilestone: (milestone: MilestoneRead) => void
}

export const MilestoneContext = React.createContext<MilestoneContextProps>(undefined)