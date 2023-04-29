import * as React from 'react'

import { UsersLink } from '../links/UsersLink'

export const UsersHeader = () => {
    return (
        <header className='view small'>
            <div>
                <UsersLink/>
            </div>
        </header>
    )
}