import * as React from 'react'

import * as LoadIcon from '/src/images/load.png'

export const LoadingView = () => (
    <main className="view reduced loading">
        <main>
            <div>
                <img className="load" src={LoadIcon}/>
            </div>
        </main>
    </main>
)