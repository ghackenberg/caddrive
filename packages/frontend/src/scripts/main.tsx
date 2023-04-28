import 'process/browser'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Helmet } from 'react-helmet'
import { BrowserRouter } from 'react-router-dom'

import { PageHeaderBoot } from './components/snippets/PageHeaderBoot'
import { LoadingView } from './components/views/Loading'

import AppIcon from '/src/images/app.png'

import '/src/styles/root.css'

const Root = React.lazy(() => import('./components/Root'))

const Fallback = () => {
    return (
        <>
            <PageHeaderBoot/>
            <LoadingView/>
        </>
    )
}

// Create root
const root = document.createElement('div')
// Append root
document.body.appendChild(root)
// Render root
ReactDOM.render((
    <>
        <Helmet>
            <link rel="icon" href={AppIcon}/>
        </Helmet>
        <BrowserRouter>
            <React.Suspense fallback={<Fallback/>}>
                <Root/>
            </React.Suspense>
        </BrowserRouter>
    </>
), root)