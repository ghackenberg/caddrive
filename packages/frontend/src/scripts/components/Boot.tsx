import * as React from 'react'

import { LoadingView } from './views/Loading'

import AppIcon from '/src/images/app.png'

import '/src/styles/root.css'

const Root = React.lazy(() => import('./Root'))

const Fallback = () => {
    return (
        <>
            <header>
                <div>
                    <span>
                        <a>
                            <img src={AppIcon} className='icon small'/>
                            ProductBoard
                        </a>
                    </span>
                </div>
            </header>
            <LoadingView/>
        </>
    )
}

export const Boot = () => {
    return (
        <React.Suspense fallback={<Fallback/>}>
            <Root/>
        </React.Suspense>
    )
}