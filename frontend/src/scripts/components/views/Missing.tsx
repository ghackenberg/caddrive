import * as React from 'react'
// Links
import { HomeLink } from '../links/HomeLink'

export const MissingView = () => (
    
    <div className="view missing">
        <header>
            <nav>
                <HomeLink/>
            </nav>
        </header>
        <main>
            <div>
                <h1>Missing</h1>
                <p>Please fix this error.</p>
            </div>
        </main>
    </div>

)