import { MemberRead } from 'productboard-common'
import { createContext } from 'react'

type MemberContextProps = {
    contextMember: MemberRead
    setContextMember: (member: MemberRead) => void
}

export const MemberContext = createContext<MemberContextProps>(undefined)