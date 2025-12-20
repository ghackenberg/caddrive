import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { PageHeaderBoot } from './components/snippets/PageHeaderBoot.js'
import { LoadingView } from './components/views/Loading.js'
import AppIcon from '/src/images/app.png'
import '/src/styles/root.css'

const Root = lazy(() => import('./components/Root.js'))

const Fallback = () => {
    return (
        <>
            <PageHeaderBoot/>
            <LoadingView/>
        </>
    )
}

// Create root
const container = document.createElement('div')
// Append root
document.body.appendChild(container)
// Create root
const root = createRoot(container)
// Render root
root.render(
    <BrowserRouter>
        <title>CADdrive - Your collaborative workspace for LDraw&trade; models</title>
        <link rel="icon" href={AppIcon}/>
        <Suspense fallback={<Fallback/>}>
            <Root/>           
        </Suspense>
    </BrowserRouter>
)