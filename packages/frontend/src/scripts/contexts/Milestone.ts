import { MilestoneRead } from 'productboard-common'
import { createContext } from 'react'

type MilestoneContextProps = {
    contextMilestone: MilestoneRead
    setContextMilestone: (milestone: MilestoneRead) => void
}

export const MilestoneContext = createContext<MilestoneContextProps>(undefined)