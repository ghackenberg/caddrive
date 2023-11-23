import * as React from 'react'

import { useMilestone } from '../../hooks/entity'

export const MilestoneNameWidget = (props: { productId: string, milestoneId: string }) => {
    const milestone = useMilestone(props.productId, props.milestoneId)
    return (
        <span className='value milestone_name'>
            {milestone ? (
                milestone.label
            ) : (
                <span className='loading'/>
            )}
        </span>
    )
}