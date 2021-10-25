import * as React from 'react'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
// Commons
import { Audit, Product, Version } from 'fhooe-audit-platform-common'
// Links
import { VersionLink } from './VersionLink'

export const AuditLink = (props: {product: Product, version: Version, audit?: Audit}) => {

    return (
        <Fragment>
            <VersionLink product={props.product} version={props.version}/>
            { props.audit ? (
                <span>
                    <Link to={`/events?audit=${props.audit.id}`}>{props.audit.name}</Link>
                </span>
            ) : (
                <span>
                    <Link to={`/audit/new?version=${props.version.id}`}>New</Link>
                </span>
            )}
        </Fragment>  
    )

}