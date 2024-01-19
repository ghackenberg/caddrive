import * as React from 'react'

import { Member } from 'productboard-common'

type MemberContextProps = {
    contextMember: Member
    setContextMember: (member: Member) => void
}

export const MemberContext = React.createContext<MemberContextProps>(undefined)