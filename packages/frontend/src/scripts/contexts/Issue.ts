import { IssueRead } from 'productboard-common'
import { createContext } from 'react'

type IssueContextProps = {
    contextIssue: IssueRead
    setContextIssue: (issue: IssueRead) => void
}

export const IssueContext = createContext<IssueContextProps>(undefined)