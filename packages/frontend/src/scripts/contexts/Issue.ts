import * as React from 'react'

import { IssueRead } from 'productboard-common'

type IssueContextProps = {
    contextIssue: IssueRead
    setContextIssue: (issue: IssueRead) => void
}

export const IssueContext = React.createContext<IssueContextProps>(undefined)