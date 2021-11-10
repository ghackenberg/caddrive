import * as React from 'react'
import { Fragment } from 'react'
// Commons
import { Audit, CommentEvent, Event, Product, Version } from 'fhooe-audit-platform-common'
// Links
import { AuditLink } from './AuditLink'

export const EventLink = (props: {product: Product, version: Version, audit: Audit, event?: Event}) => {

    return (
        <Fragment>
            <AuditLink product={props.product} version={props.version} audit={props.audit}/>
            { props.event ? (
                <span>
                    <a>{props.event.type == 'comment' ? (props.event as CommentEvent).text : props.event.id}</a>
                </span>
            ) : (
                <span>
                    <a>New comment</a>
                </span>
            )}
        </Fragment>  
    )

}