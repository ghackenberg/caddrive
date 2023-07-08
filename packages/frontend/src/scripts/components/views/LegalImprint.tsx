import * as React from 'react'

import { LegalFooter } from '../snippets/LegalFooter'

export const LegalImprintView = () => {
    return (
        <main className="view legal imprint">
            <div>
                <div className='main'>
                    <h1>Imprint</h1>
                    <h2>Persons</h2>
                    <h3>Project coordinator</h3>
                    <p>
                        <strong>Dr. Georg Hackenberg, M.Sc.</strong><br/>
                        <strong>Professor for Industrial Informatics</strong><br/>
                        School of Engineering<br/>
                        University of Applied Sciences Upper Austria<br/>
                        Stelzhammerstr. 23, 4600 Wels, Austria<br/>
                        <a href="mailto:georg@caddrive.org">georg@caddrive.org</a>
                    </p>
                    <h3>Project sponsor</h3>
                    <p>
                        <strong>FH-Prof. Dr. DI Christian Zehetner</strong><br/>
                        <strong>Professor for Product Development</strong><br/>
                        School of Engineering<br/>
                        University of Applied Sciences Upper Austria<br/>
                        Stelzhammerstr. 23, 4600 Wels, Austria<br/>
                        <a href="mailto:christian@caddrive.org">christian@caddrive.org</a>
                    </p>
                    <h3>Software engineer</h3>
                    <p>
                        <strong>Dominik Frühwirth, M.Sc.</strong><br/>
                        <strong>Researcher</strong><br/>
                        School of Engineering<br/>
                        University of Applied Sciences Upper Austria<br/>
                        Stelzhammerstr. 23, 4600 Wels, Austria<br/>
                        <a href="mailto:dominik@caddrive.org">dominik@caddrive.org</a>
                    </p>
                    <h2>Libraries</h2>
                    <h3>Parts</h3>
                    <p>
                        We use the <a href="https://ldraw.org" target="_blank">LDraw&trade;</a> parts library.
                    </p>
                    <h3>Icons</h3>
                    <p>
                        We use the <a href="https://uxwing.com" target="_blank">uxwing.com</a> icons library.
                    </p>
                </div>
                <LegalFooter replace={true}/>
            </div>
        </main>
    )
}