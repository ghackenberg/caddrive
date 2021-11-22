import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
// Links
import { HomeLink } from './HomeLink'

export const UsersLink = () => {
    return (
        <Fragment>
            <HomeLink/>
            <span>
                <Link to="/users">Users</Link>
            </span>
        </Fragment>
    )
}