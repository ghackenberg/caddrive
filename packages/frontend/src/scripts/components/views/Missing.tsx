import * as React from 'react'

import { LegalFooter } from '../snippets/LegalFooter'

import EmptyIcon from '/src/images/empty.png'

export const MissingView = () => (
    <main className="view missing">
        <div>
            <div className='main center'>
                <div>
                    <img src={EmptyIcon}/>
                    <p>Please fix this error.</p>
                </div>
            </div>
            <LegalFooter/>
        </div>
    </main>
)