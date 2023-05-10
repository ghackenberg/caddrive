import * as React from 'react'

import { LegalFooter } from '../snippets/LegalFooter'

export const LegalImprintView = () => {
    return (
        <main className="view legal imprint">
            <div>
                <div>
                    <h1>Imprint</h1>
                    <h2>Project coordinator</h2>
                    <p>
                        <strong>Dr. Georg Hackenberg, M.Sc.</strong><br/>
                        <strong>Professor for Industrial Informatics</strong><br/>
                        School of Engineering<br/>
                        University of Applied Sciences Upper Austria<br/>
                        Stelzhammerstr. 23, 4600 Wels, Austria<br/>
                        <a href="mailto:georg@caddrive.com">georg@caddrive.com</a>
                    </p>
                    <h2>Project sponsor</h2>
                    <p>
                        <strong>FH-Prof. Dr. DI Christian Zehetner</strong><br/>
                        <strong>Professor for Product Development</strong><br/>
                        School of Engineering<br/>
                        University of Applied Sciences Upper Austria<br/>
                        Stelzhammerstr. 23, 4600 Wels, Austria<br/>
                        <a href="mailto:christian@caddrive.com">christian@caddrive.com</a>
                    </p>
                    <h2>Software engineer</h2>
                    <p>
                        <strong>Dominik Frühwirth, M.Sc.</strong><br/>
                        <strong>Researcher</strong><br/>
                        School of Engineering<br/>
                        University of Applied Sciences Upper Austria<br/>
                        Stelzhammerstr. 23, 4600 Wels, Austria<br/>
                        <a href="mailto:dominik@caddrive.com">dominik@caddrive.com</a>
                    </p>
                </div>
                <LegalFooter replace={true}/>
            </div>
        </main>
    )
}