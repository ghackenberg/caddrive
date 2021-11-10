import * as React from 'react'
import { useEffect, useState } from 'react'
// Types
import { Version } from 'fhooe-audit-platform-common'
// Clients
import { VersionAPI } from '../../clients/rest'
// Widgets
import { ModelView } from './ModelView'

export const ProductView = (props: { id: string, mouse: boolean }) => {

    const [versions, setVersions] = useState<Version[]>(null)
    
    useEffect(() => { VersionAPI.findVersions(undefined, undefined, props.id).then(setVersions) }, [props.id])

    return (
        <div className="widget product_view">
            { versions && versions.length > 0 && <ModelView url={`/rest/models/${versions[versions.length - 1].id}`} mouse={props.mouse}/> }
        </div>
    )
    
}