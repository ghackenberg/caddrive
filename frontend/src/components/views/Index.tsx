import * as React from 'react'
import { Header } from '../snippets/Header'
import { Navigation } from '../snippets/Navigation'
import { SceneGraph } from '../widgets/SceneGraph'

export const Index = () => (
    <React.Fragment>
        <Header/>
        <Navigation/>
        <main>
            <h1>Index</h1>
            <p>Welcome!</p>
            <SceneGraph url="/models/Avocado.glb"/>
            <SceneGraph url="/models/GearboxAssy.glb"/>
            <SceneGraph url="/models/Buggy.glb"/>
        </main>
    </React.Fragment>
)