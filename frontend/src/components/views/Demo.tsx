import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { SceneView } from '../widgets/SceneView'

export const Demo = (props: RouteComponentProps<{ name: string }>) => {
    return <SceneView url={`/models/${props.match.params.name}.glb`}/>
}