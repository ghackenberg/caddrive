import * as React from 'react'

import { Milestone } from 'productboard-common'

type MilestoneContextProps = {
    contextMilestone: Milestone
    setContextMilestone: (milestone: Milestone) => void
}

export const MilestoneContext = React.createContext<MilestoneContextProps>(undefined)