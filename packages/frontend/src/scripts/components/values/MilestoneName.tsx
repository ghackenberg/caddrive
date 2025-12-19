import { useMilestone } from '../../hooks/entity.js'

export const MilestoneName = (props: { productId: string, milestoneId: string, class?: string }) => {
    const milestone = useMilestone(props.productId, props.milestoneId)
    return (
        <span className={`value milestone_name ${props.class || ''}`}>
            {milestone ? (
                milestone.label
            ) : (
                <span className='loading'/>
            )}
        </span>
    )
}