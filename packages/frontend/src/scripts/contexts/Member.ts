import * as React from 'react'

import { MemberRead } from 'productboard-common'

type MemberContextProps = {
    contextMember: MemberRead
    setContextMember: (member: MemberRead) => void
}

export const MemberContext = React.createContext<MemberContextProps>(undefined)