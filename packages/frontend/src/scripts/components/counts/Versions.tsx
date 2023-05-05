import * as React from 'react'

import { useVersions } from '../../hooks/route'

export const VersionCount = (props: { productId: string }) => {
    const versions = useVersions(props.productId)
    return (
        <>
            {versions ? versions.length : '?'}
        </>
    )
}