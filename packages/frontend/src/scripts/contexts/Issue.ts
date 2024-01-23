import * as React from 'react'

import { Issue } from 'productboard-common'

type IssueContextProps = {
    contextIssue: Issue
    setContextIssue: (issue: Issue) => void
}

export const IssueContext = React.createContext<IssueContextProps>(undefined)