import * as React from 'react'

import { CommentRead } from 'productboard-common'

type CommentContextProps = {
    contextComment: CommentRead
    setContextComment: (comment: CommentRead) => void
}

export const CommentContext = React.createContext<CommentContextProps>(undefined)