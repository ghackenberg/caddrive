import * as React from 'react'
import { Fragment } from 'react'
// Commons
import { Comment, Issue, Product } from 'fhooe-audit-platform-common'
// Links
import { IssueLink } from './IssueLink'

export const CommentLink = (props: {product: Product, issue: Issue, comment?: Comment}) => {
    return (
        <Fragment>
            <IssueLink product={props.product} issue={props.issue}/>
            { props.comment ? (
                <span>
                    <a>{props.comment.text}</a>
                </span>
            ) : (
                <span>
                    <a>New comment</a>
                </span>
            )}
        </Fragment>  
    )
}