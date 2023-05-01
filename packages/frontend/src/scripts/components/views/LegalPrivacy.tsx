import * as React from 'react'

import { LegalFooter } from '../snippets/LegalFooter'

export const LegalPrivacyView = () => {
    return (
        <>
            <main className="view legal privacy">
                <div>
                    <div>
                        <h1>Privacy policy</h1>
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