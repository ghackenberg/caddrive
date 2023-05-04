import * as React from 'react'

import { LegalFooter } from '../snippets/LegalFooter'

export const LegalPrivacyView = () => {
    return (
        <>
            <main className="view legal privacy">
                <div>
                    <div>
                        <h1>
                            Privacy
                        </h1>
                        <p>
                            CADDrive stores the following <strong>user data</strong> and <strong>product data</strong>.
                            You always can request to delete your personal data from our platform.
                            For such inquiries please send an email to <a href="mailto:mail@caddrive.com">mail@caddrive.com</a>
                        </p>
                        <h2>
                            User data
                        </h2>
                        <h3>
                            ... visible to <strong>you only</strong>
                        </h3>
                        <ul>
                            <li>
                                Your email address
                            </li>
                        </ul>
                        <h3>
                            ... visible to <strong>all other users</strong>
                        </h3>
                        <ul>
                            <li>
                                Your profile name
                            </li>
                            <li>
                                Your profile picture
                            </li>
                        </ul>
                        <h2>
                            Product data
                        </h2>
                        <h3>
                            ... visible to <strong>other product members only</strong>
                        </h3>
                        <ul>
                            <li>
                                The <strong>private</strong> products, you created
                            </li>
                            <li>
                                The versions of <strong>private</strong> products, you created
                            </li>
                            <li>
                                The issues of <strong>private</strong> products, you created
                            </li>
                            <li>
                                The comments of issues of <strong>private</strong> products, you created
                            </li>
                            <li>
                                The milestones of <strong>private</strong> products, you created
                            </li>
                            <li>
                                The members of <strong>private</strong> products, you created
                            </li>
                        </ul>
                        <h3>
                            ... visible to <strong>all other users</strong>
                        </h3>
                        <ul>
                            <li>
                                The <strong>public</strong> products, you created
                            </li>
                            <li>
                                The versions of <strong>public</strong> products, you created
                            </li>
                            <li>
                                The issues of <strong>public</strong> products, you created
                            </li>
                            <li>
                                The comments of issues of <strong>public</strong> products, you created
                            </li>
                            <li>
                                The milestones of <strong>public</strong> products, you created
                            </li>
                            <li>
                                The members of <strong>public</strong> products, you created
                            </li>
                        </ul>
                    </div>
                    <LegalFooter replace={true}/>
                </div>
            </main>
        </>
    )
}