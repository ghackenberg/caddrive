import * as React from 'react'

import { MilestoneRead } from 'productboard-common'

export const MilestoneProgressWidget = (props: { milestone: MilestoneRead }) => {

    const open = props.milestone.openIssueCount
    const closed = props.milestone.closedIssueCount

    function width() {
        const total = open + closed
        if (total > 0) {
            return Math.floor(closed / total * 100)
        } else {
            return 0
        }
    }

    return (
        <div className='progress'>
            <div style={{width: `${width()}%` }}/>
        </div>
    )
}