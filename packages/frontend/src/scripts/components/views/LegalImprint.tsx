import * as React from 'react'

import { LegalFooter } from '../snippets/LegalFooter'

export const LegalImprintView = () => {
    return (
        <>
            <main className="view legal imprint">
                <div>
                    <div>
                        <h1>Imprint</h1>
                        <p>
                            Coming soon...
                        </p>
                    </div>
                    <LegalFooter replace={true}/>
                </div>
            </main>
        </>
    )
}