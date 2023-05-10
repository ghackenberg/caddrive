import * as React from 'react'

import { useIssues } from '../../hooks/list'

export const MilestoneProgressWidget = (props: { productId: string, milestoneId: string }) => {
    const open = useIssues(props.productId, props.milestoneId, 'open')
    const closed = useIssues(props.productId, props.milestoneId, 'closed')

    function width() {
        const total = open.length + closed.length
        if (total > 0) {
            return Math.floor(closed.length / total * 100)
        } else {
            return 100
        }
    }

    return (
        open && closed ? (
            <div className='progress'>
                <div style={{width: `${width()}%` }}/>
            </div>
        ) : (
            <>?</>
        )
    )
}