import { Version } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

export const VersionLink = (props: {version?: Version}) => {

    return (
        <Fragment>
            <span>
                <Link to="/">Welcome Page</Link>
            </span>
            <span>
                <Link to='/versions'>Versions</Link>
            </span>
            { props.version ? (
            <span>
                <Link to={`/versions/${props.version.id}`}>{'Version ' + props.version.name}</Link>
            </span>
            ) : (
            <span>
                <Link to={`/versions/new`}>new Version</Link>
            </span>
            )}
        </Fragment>  
    )
}