import { UsersLink } from '../links/UsersLink.js'

export const UsersHeader = () => {
    return (
        <header className='view users'>
            <div className='entity'>
                <UsersLink/>
            </div>
        </header>
    )
}