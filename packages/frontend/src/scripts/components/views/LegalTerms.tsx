import * as React from 'react'

import { LegalFooter } from '../snippets/LegalFooter'

export const LegalTermsView = () => {
    return (
        <main className="view legal terms">
            <div>
                <div>
                    <h1>Terms</h1>
                    <p>
                        Coming soon...
                    </p>
                </div>
                <LegalFooter replace={true}/>
            </div>
        </main>
    )
}