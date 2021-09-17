import { Audit } from 'fhooe-audit-platform-common'
import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'

export const AuditLink = (props: {audit?: Audit}) => {

    return (
        <Fragment>
            <span>
                <Link to="/">Welcome Page</Link>
            </span>
            <span>
                <Link to='/audits'>Audits</Link>
            </span>
            { props.audit ? (
            <span>
                <Link to={`/audits/${props.audit.id}`}>{'Audit ' + props.audit.name}</Link>
            </span>
            ) : (
            <span>
                <Link to={`/audits/new`}>new Audit</Link>
            </span>
            )}
        </Fragment>  
    )
}