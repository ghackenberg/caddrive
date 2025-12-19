import { useMembers } from '../../hooks/list.js'

export const MemberCount = (props: { productId: string }) => {
    const members = useMembers(props.productId)
    return (
        <>
            {members ? members.length : '?'}
        </>
    )
}