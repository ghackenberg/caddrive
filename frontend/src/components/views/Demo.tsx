import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { ModelViewer } from '../widgets/ModelViewer'

export const Demo = (props: RouteComponentProps<{ name: string }>) => {
    return (
        <div className="view demo">
            <Header/>
            <Navigation/>
            <main>
                <ModelViewer url={`/models/${props.match.params.name}.glb`}/>
            </main>
        </div>
    )
}