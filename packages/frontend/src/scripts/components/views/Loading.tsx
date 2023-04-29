import * as React from 'react'

import LoadIcon from '/src/images/load.png'

export const LoadingView = () => (
    <main className="view loading">
        <img className="position center animation spin icon medium" src={LoadIcon}/>
    </main>
)