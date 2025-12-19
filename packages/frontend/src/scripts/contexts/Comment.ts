import { CommentRead } from 'productboard-common'
import { createContext } from 'react'

type CommentContextProps = {
    contextComment: CommentRead
    setContextComment: (comment: CommentRead) => void
}

export const CommentContext = createContext<CommentContextProps>(undefined)