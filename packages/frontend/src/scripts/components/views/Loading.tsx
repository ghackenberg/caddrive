import * as React from 'react'

import * as LoadIcon from '/src/images/load.png'

export const LoadingView = () => (
    <main className="view reduced loading">
        <img className="position center animation spin icon medium" src={LoadIcon}/>
    </main>
)