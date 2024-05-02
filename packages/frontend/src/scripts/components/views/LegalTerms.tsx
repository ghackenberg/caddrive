import * as React from 'react'

import { LegalFooter } from '../snippets/LegalFooter'

export const LegalTermsView = () => {
    return (
        <main className="view legal terms">
            <div>
                <div className='main'>
                    <h1>Terms</h1>
                    <h2>1. Our rights and obligations</h2>
                    <ol>
                        <li>
                            <em>Coming soon...</em>
                        </li>
                    </ol>
                    <h2>2. Your rights and obligations</h2>
                    <h3>2.1 Offensive data</h3>
                    <ol>
                        <li>
                            You <strong>must not</strong> upload data (e.g. texts, images, sounds, and models) to our platform, which is offensive to other people.
                        </li>
                    </ol>
                    <h3>2.2 Data copyright</h3>
                    <ol>
                        <li>
                            You <strong>must not</strong> upload data (e.g. texts, images, sounds, and models) to our platform, for which you have no copyright.
                        </li>
                        <li>
                            You <strong>must not</strong> upload data (e.g. texts, images, sounds, and models) to our platform, for which you have no right to transfer copyright to us permanently.
                        </li>
                        <li>
                            By uploading data (e.g. texts, images, sounds, and models) to our platform, you <strong>transfer copyright</strong> for this data to us permanently.
                        </li>
                    </ol>
                </div>
                <LegalFooter replace={true}/>
            </div>
        </main>
    )
}