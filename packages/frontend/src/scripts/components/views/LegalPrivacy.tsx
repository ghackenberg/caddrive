import * as React from 'react'

import { LegalFooter } from '../snippets/LegalFooter'

export const LegalPrivacyView = () => {
    return (
        <main className="view legal privacy">
            <div>
                <div>
                    <h1>
                        Privacy
                    </h1>
                    <p>
                        CADdrive stores the following <strong>user data</strong> and <strong>product data</strong>.
                        You always can request to delete your personal data from our platform.
                        For such inquiries please send an email to <a href="mailto:mail@caddrive.com">mail@caddrive.com</a>
                    </p>
                    <h2>
                        1. User data
                    </h2>
                    <h3>
                        1.1. User data visible to you only
                    </h3>
                    <ul>
                        <li>
                            Your <strong>email address</strong>
                        </li>
                    </ul>
                    <h3>
                        1.2. User data visible to all other users
                    </h3>
                    <ul>
                        <li>
                            Your <strong>profile name</strong>
                        </li>
                        <li>
                            Your <strong>profile picture</strong>
                        </li>
                    </ul>
                    <h2>
                        2. Product data
                    </h2>
                    <h3>
                        2.1. Product data visible to other product members only
                    </h3>
                    <ul>
                        <li>
                            The <strong><u>private</u> products</strong> you created including their
                            <ul>
                                <li>
                                    <em>name and description</em>
                                </li>
                            </ul>
                        </li>
                        <li>
                            The <strong>versions of <u>private</u> products</strong> you created including their
                            <ul>
                                <li>
                                    <em>date, number, description, model, and image</em>
                                </li>
                            </ul>
                        </li>
                        <li>
                            The <strong>issues of <u>private</u> products</strong> you created including their
                            <ul>
                                <li>
                                    <em>date, label, description, audio, milestone, assignees, and state</em>
                                </li>
                            </ul>
                        </li>
                        <li>
                            The <strong>comments of issues of <u>private</u> products</strong> you created including their
                            <ul>
                                <li>
                                    <em>date, description, audio, and action</em>
                                </li>
                            </ul>
                        </li>
                        <li>
                            The <strong>milestones of <u>private</u> products</strong> you created including their
                            <ul>
                                <li>
                                    <em>start, end, and name</em>
                                </li>
                            </ul>
                        </li>
                        <li>
                            The <strong>members of <u>private</u> products</strong> you created including their
                            <ul>
                                <li>
                                    <em>user and role</em>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <h3>
                        2.2. Product data visible to all other users
                    </h3>
                    <ul>
                        <li>
                            The <strong><u>public</u> products</strong> you created including their
                            <ul>
                                <li>
                                    <em>name and description</em>
                                </li>
                            </ul>
                        </li>
                        <li>
                            The <strong>versions of <u>public</u> products</strong> you created including their
                            <ul>
                                <li>
                                    <em>date, number, description, model, and image</em>
                                </li>
                            </ul>
                        </li>
                        <li>
                            The <strong>issues of <u>public</u> products</strong> you created including their
                            <ul>
                                <li>
                                    <em>date, label, description, audio, milestone, assignees, and state</em>
                                </li>
                            </ul>
                        </li>
                        <li>
                            The <strong>comments of issues of <u>public</u> products</strong> you created including their
                            <ul>
                                <li>
                                    <em>date, description, audio, and action</em>
                                </li>
                            </ul>
                        </li>
                        <li>
                            The <strong>milestones of <u>public</u> products</strong> you created including their
                            <ul>
                                <li>
                                    <em>start, end, and name</em>
                                </li>
                            </ul>
                        </li>
                        <li>
                            The <strong>members of <u>public</u> products</strong> you created including their
                            <ul>
                                <li>
                                    <em>user and role</em>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <LegalFooter replace={true}/>
            </div>
        </main>
    )
}