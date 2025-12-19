import { useVersions } from '../../hooks/list.js'

export const VersionCount = (props: { productId: string }) => {
    const versions = useVersions(props.productId)
    return (
        <>
            {versions ? versions.length : '?'}
        </>
    )
}