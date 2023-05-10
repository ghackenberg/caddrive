import * as React from 'react'

import { LegalFooter } from '../snippets/LegalFooter'

export const LegalTermsView = () => {
    return (
        <main className="view legal terms">
            <div>
                <div>
                    <h1>Terms</h1>
                    <h2>1. Our obligations</h2>
                    <ol>
                        <li>
                            <em>Coming soon...</em>
                        </li>
                    </ol>
                    <h2>2. Your obligations</h2>
                    <ol>
                        <li>
                            You must not upload data (e.g. texts, images, sounds, and models) to our platform, for which you have no copyright.
                        </li>
                        <li>
                            You must not upload data (e.g. texts, images, sounds, and models) to our platform, for which you have no right to transfer copyright to us permanently.
                        </li>
                        <li>
                            When you upload data (e.g. texts, images, sounds, and models) to our platform, you transfer copyright for this data to us permanently.
                        </li>
                    </ol>
                </div>
                <LegalFooter replace={true}/>
            </div>
        </main>
    )
}