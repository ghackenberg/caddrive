import * as React from 'react'

import LoadIcon from '/src/images/load.png'

export const LoadingView = () => (
    <main className="view loading">
        <div>
            <div className='main center'>
                <div>
                    <img className="animation spin" src={LoadIcon}/>
                </div>
            </div>
        </div>
    </main>
)