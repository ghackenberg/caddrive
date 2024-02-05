import * as React from 'react'

import { Comment } from 'productboard-common'

type CommentContextProps = {
    contextComment: Comment
    setContextComment: (comment: Comment) => void
}

export const CommentContext = React.createContext<CommentContextProps>(undefined)