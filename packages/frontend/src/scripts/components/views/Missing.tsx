import * as React from 'react'

import { LegalFooter } from '../snippets/LegalFooter'

export const MissingView = () => (
    <main className="view missing">
        <div>
            <div>
                <h1>Missing</h1>
                <p>Please fix this error.</p>
            </div>
            <LegalFooter/>
        </div>
    </main>
)