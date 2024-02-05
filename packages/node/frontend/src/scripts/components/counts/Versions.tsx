import * as React from 'react'

import { useVersions } from '../../hooks/list'

export const VersionCount = (props: { productId: string }) => {
    const versions = useVersions(props.productId)
    return (
        <>
            {versions ? versions.length : '?'}
        </>
    )
}